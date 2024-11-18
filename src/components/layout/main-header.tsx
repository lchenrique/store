export interface MainHeaderProps {
  title: string;
  description?: string;
}

export default function MainHeader({ title, description }: MainHeaderProps) {
  return (
    <div className="w-full ">
      <div className="mb-8 flex items-start gap-4 relative">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="mt-2 text-foreground/70">{description}</p>}
        </div>
      </div>
    </div>
  );
}
