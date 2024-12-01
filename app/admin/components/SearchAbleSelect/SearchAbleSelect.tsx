import Select from 'react-select';

export default function SearchAbleSelect({ options,isDisabled, defaultValue, value, getLabel, name, id, getValue, onChange }: {
  options: any[],
  isClearable?: boolean,
  defaultValue?: any,
  isDisabled?: boolean,
  value?: any,
  getLabel: any,
  getValue: any,
  id: number,
  name: string
  onChange?: Function
}) {



  return (
    <div className="remove-input-txt-border border-gray-50">
      <Select
        defaultValue={defaultValue ? defaultValue : null}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isDisabled ? '#111827' : '#111827',
            backgroundColor:state.isDisabled ?'#F9FAFB':'#F9FAFB',
            borderBlockColor:state.isFocused?'#111827':'#111827',
          }),
        }}
        isClearable
        isSearchable
        id={id.toString()}
        instanceId={id.toString()}
        name={name}
        options={options}
        isDisabled={isDisabled}
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