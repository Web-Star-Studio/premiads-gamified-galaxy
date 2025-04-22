
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { MetricCard } from "./metrics/MetricCard";
import { LoadingState } from "./metrics/LoadingState";
import { ErrorState } from "./metrics/ErrorState";
import { getMetricsData } from "./metrics/metricsConfig";

const SystemMetrics = () => {
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  if (error) {
    return <ErrorState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  const metricsData = getMetricsData(metrics);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metricsData.map((metric, index) => (
        <MetricCard 
          key={metric.title}
          {...metric}
          index={index}
        />
      ))}
    </div>
  );
};

export default SystemMetrics;
