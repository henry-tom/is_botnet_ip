import React, { useState } from 'react';
export default function IsPublished({ item }) {
    const [isChecked, setIsChecked] = useState(item.published);

    const handleOnChange = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className="mt-2 ml-2">
            <input id={item.id} type="checkbox" checked={isChecked} onChange={handleOnChange} value="true" className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor={item.id} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">published</label>
        </div>
    );
}
