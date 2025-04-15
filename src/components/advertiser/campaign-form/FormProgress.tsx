
interface FormProgressProps {
  step: number;
  title: string;
}

const FormProgress = ({ step, title }: FormProgressProps) => {
  return (
    <>
      <h3 className="text-xl font-heading">{title}</h3>
      <div className="flex items-center mt-2">
        <div className={`h-1 w-1/4 ${step >= 1 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
        <div className={`h-1 w-1/4 ${step >= 2 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
        <div className={`h-1 w-1/4 ${step >= 3 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
        <div className={`h-1 w-1/4 ${step >= 4 ? "bg-neon-cyan" : "bg-gray-700"}`}></div>
      </div>
    </>
  );
};

export default FormProgress;
