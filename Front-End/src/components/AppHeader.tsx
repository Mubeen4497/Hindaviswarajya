import { useScreenSize } from "./ui/use-screen-size";

// App Header Component - Not currently in use
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AppHeader({ title, subtitle, actions }: AppHeaderProps) {
  const { isDesktop } = useScreenSize();
  
  // Only show on desktop
  if (!isDesktop) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-[#FF6F00]">{title}</h1>
              {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
