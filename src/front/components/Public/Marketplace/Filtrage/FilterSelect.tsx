export function FilterSelect({ label, options, value, onChange }: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-['Poppins',sans-serif] font-medium text-[14px] text-black">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-10 px-3 pr-8 border border-gray-light rounded-[5px] bg-white font-['Poppins',sans-serif] text-[14px] text-gray appearance-none outline-none cursor-pointer"
                >
                    <option value="">{label}</option>
                    {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                        <path d="M1 1L5 5L9 1" stroke="#8C8A85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
