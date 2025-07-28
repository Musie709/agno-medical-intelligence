import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base input classes
    const baseInputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Custom 24-hour time picker
    if (type === 'custom-time') {
        const value = props.value || '';
        const [hh, mm] = value.split(':');
        const handleHourChange = (e) => {
            let hour = e.target.value.replace(/\D/g, '');
            if (hour.length > 2) hour = hour.slice(0, 2);
            if (hour !== '' && (parseInt(hour, 10) < 0 || parseInt(hour, 10) > 23)) return;
            props.onChange && props.onChange({
                target: {
                    value: (hour.padStart(2, '0') || '00') + ':' + (mm || '00')
                }
            });
        };
        const handleMinuteChange = (e) => {
            let min = e.target.value.replace(/\D/g, '');
            if (min.length > 2) min = min.slice(0, 2);
            if (min !== '' && (parseInt(min, 10) < 0 || parseInt(min, 10) > 59)) return;
            props.onChange && props.onChange({
                target: {
                    value: (hh || '00') + ':' + (min.padStart(2, '0') || '00')
                }
            });
        };
        return (
            <div className="space-y-2">
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            error ? "text-destructive" : "text-foreground"
                        )}
                    >
                        {label}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        min="0"
                        max="23"
                        value={hh || ''}
                        onChange={handleHourChange}
                        placeholder="HH"
                        className="w-14 px-2 py-2 border border-input rounded-md text-center"
                        disabled={props.disabled}
                    />
                    <span>:</span>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={mm || ''}
                        onChange={handleMinuteChange}
                        placeholder="MM"
                        className="w-14 px-2 py-2 border border-input rounded-md text-center"
                        disabled={props.disabled}
                    />
                </div>
                {description && !error && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <input
                type={type}
                className={cn(
                    baseInputClasses,
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />

            {description && !error && (
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;