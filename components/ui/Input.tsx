'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted)]">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              w-full px-4 py-3 rounded-xl border bg-[var(--card-bg)] text-[var(--foreground)]
              placeholder:text-[var(--muted)] transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-purple)] focus:border-transparent
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--border)]'}
              ${className}
            `}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted)]">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
                {hint && !error && <p className="mt-1.5 text-sm text-[var(--muted)]">{hint}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3 rounded-xl border bg-[var(--card-bg)] text-[var(--foreground)]
            placeholder:text-[var(--muted)] transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-purple)] focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--border)]'}
            ${className}
          `}
                    rows={4}
                    {...props}
                />
                {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
                {hint && !error && <p className="mt-1.5 text-sm text-[var(--muted)]">{hint}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-3 rounded-xl border bg-[var(--card-bg)] text-[var(--foreground)]
            transition-all duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[var(--snoonu-purple)] focus:border-transparent
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--border)]'}
            ${className}
          `}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

