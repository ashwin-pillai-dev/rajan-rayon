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
    <div className="remove-input-txt-border border-gray">
      <Select
        defaultValue={defaultValue ? defaultValue : null}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isDisabled ? 'gray' : 'gray',
            backgroundColor:state.isDisabled ?'lightGray':'white'
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