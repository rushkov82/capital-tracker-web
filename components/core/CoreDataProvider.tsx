"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createDefaultPlanSettings,
  fetchPlanSettings,
  type PlanSettings,
} from "@/lib/plan";
import { fetchOperations, type Operation } from "@/lib/operations";
import { readDemoOperations, readDemoPlan } from "@/lib/demo-storage";
import { showToast } from "@/lib/toast";

type StorageMode = "remote" | "local";

type CoreDataContextValue = {
  plan: PlanSettings | null;
  setPlan: React.Dispatch<React.SetStateAction<PlanSettings | null>>;
  operations: Operation[];
  setOperations: React.Dispatch<React.SetStateAction<Operation[]>>;
  refreshPlan: () => Promise<void>;
  refreshOperations: () => Promise<void>;
  isLoading: boolean;
  storageMode: StorageMode;
};

const CoreDataContext = createContext<CoreDataContextValue | null>(null);

export function CoreDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plan, setPlan] = useState<PlanSettings | null>(null);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageMode, setStorageMode] = useState<StorageMode>("remote");

  const refreshPlan = useCallback(async () => {
    if (storageMode === "local") {
      setPlan(readDemoPlan());
      return;
    }

    try {
      const data = await fetchPlanSettings();
      setPlan(data);
    } catch {
      setPlan(createDefaultPlanSettings());

      showToast({
        type: "error",
        title: "Ошибка",
        description:
          "Не удалось загрузить стратегию, показаны значения по умолчанию",
      });
    }
  }, [storageMode]);

  const refreshOperations = useCallback(async () => {
    if (storageMode === "local") {
      setOperations(readDemoOperations());
      return;
    }

    try {
      const data = await fetchOperations();
      setOperations(data);
    } catch {
      setOperations([]);

      showToast({
        type: "error",
        title: "Ошибка",
        description: "Не удалось загрузить операции",
      });
    }
  }, [storageMode]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAll() {
      setIsLoading(true);

      let isAuthorized = false;

      try {
        const meResponse = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const meData = (await meResponse.json()) as {
          ok?: boolean;
          user?: { id: string } | null;
        };

        isAuthorized = Boolean(meData?.user);
      } catch {
        isAuthorized = false;
      }

      if (isCancelled) return;

      if (!isAuthorized) {
        setStorageMode("local");
        setPlan(readDemoPlan());
        setOperations(readDemoOperations());
        setIsLoading(false);
        return;
      }

      setStorageMode("remote");

      const [planResult, operationsResult] = await Promise.allSettled([
        fetchPlanSettings(),
        fetchOperations(),
      ]);

      if (isCancelled) return;

      if (planResult.status === "fulfilled") {
        setPlan(planResult.value);
      } else {
        setPlan(createDefaultPlanSettings());

        showToast({
          type: "error",
          title: "Ошибка",
          description:
            "Не удалось загрузить стратегию, показаны значения по умолчанию",
        });
      }

      if (operationsResult.status === "fulfilled") {
        setOperations(operationsResult.value);
      } else {
        setOperations([]);

        showToast({
          type: "error",
          title: "Ошибка",
          description: "Не удалось загрузить операции",
        });
      }

      setIsLoading(false);
    }

    void loadAll();

    return () => {
      isCancelled = true;
    };
  }, []);

  const value = useMemo<CoreDataContextValue>(
    () => ({
      plan,
      setPlan,
      operations,
      setOperations,
      refreshPlan,
      refreshOperations,
      isLoading,
      storageMode,
    }),
    [plan, operations, refreshPlan, refreshOperations, isLoading, storageMode]
  );

  return (
    <CoreDataContext.Provider value={value}>
      {children}
    </CoreDataContext.Provider>
  );
}

export function useCoreData() {
  const context = useContext(CoreDataContext);

  if (!context) {
    throw new Error("useCoreData must be used within CoreDataProvider");
  }

  return context;
}
