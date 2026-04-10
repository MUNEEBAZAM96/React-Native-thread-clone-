import { Thread } from "@/types/thread";
import { generateThreads } from "@/util/Generate_Dummy_Data";
import * as React from "react";

export type ThreadContextValue = {
  threads: Thread[];
  refresh: () => void;
};

export const ThreadContext = React.createContext<ThreadContextValue>({
  threads: [],
  refresh: () => {},
});

export const ThreadProvider = ({ children }: React.PropsWithChildren) => {
  const [threads, setThreads] = React.useState<Thread[]>(() =>
    generateThreads()
  );

  const refresh = React.useCallback(() => {
    setThreads(generateThreads());
  }, []);

  const value = React.useMemo(
    () => ({ threads, refresh }),
    [threads, refresh]
  );

  return (
    <ThreadContext.Provider value={value}>{children}</ThreadContext.Provider>
  );
};

/** @deprecated Use ThreadProvider */
export const ThreadProvdier = ThreadProvider;

export const useThreads = () => React.useContext(ThreadContext).threads;

export const useThreadContext = () => React.useContext(ThreadContext);
