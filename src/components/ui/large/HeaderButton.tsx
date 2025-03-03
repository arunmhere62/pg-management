import React from 'react';
import { Button } from '../button';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface IHeaderButtonProps {
  title: string;
  buttons: ButtonProps[];
}

const HeaderButton: React.FC<IHeaderButtonProps> = ({ title, buttons }) => {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-[18px] font-bold'>{title}</h1>
      <div className='flex gap-2'>
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || 'default'}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HeaderButton;
