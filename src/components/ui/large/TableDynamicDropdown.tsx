import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

type ActionButton = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'outline' | 'destructive';
};

type TableDynamicDropdownProps = {
  actions: ActionButton[];
};

export const TableDynamicDropdown: React.FC<TableDynamicDropdownProps> = ({
  actions
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-fit w-fit'>
        <DotsVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='flex flex-col gap-2'>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
            >
              {action.icon && <span className='mr-2 w-4'>{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
