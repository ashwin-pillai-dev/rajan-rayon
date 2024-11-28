import Select from 'react-select';

export default function SearchAbleSelect({ options, defaultValue, value, getLabel, name, id, getValue, onChange }: {
  options: any[],
  isClearable?: boolean,
  defaultValue?: any,
  isDisabled?: boolean,
  value?: any,
  getLabel: any,
  getValue: any,
  id: string,
  name: string
  onChange?: Function
}) {



  return (
    <div className="remove-input-txt-border">
      <Select
        defaultValue={defaultValue ? defaultValue : null}
        isClearable
        isSearchable
        id={id}
        name={name}
        options={options}
        getOptionLabel={getLabel}
        getOptionValue={getValue}
        value={value ?? value}
        onChange={(value) => {
          if (typeof (onChange) == 'function') {
            onChange(value)
          }
        }
        }
      />
    </div>
  );
};