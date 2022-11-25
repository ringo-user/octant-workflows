import React, { FC, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { cross, tick } from 'svg/misc';
import Button from 'components/core/button/button.component';
import Svg from 'components/core/svg/svg.component';

import './input-select.scss';
import InputSelectProps, { Option } from './types';
import styles from './style.module.scss';

const CustomOption = ({ innerRef, innerProps, children, isSelected }) => (
  <div ref={innerRef} className={styles.option} {...innerProps}>
    {isSelected && <Svg classNameSvg={styles.iconTick} img={tick} size={1} />}
    {children}
  </div>
);

const CustomMenu = ({ innerRef, innerProps, setIsMenuOpen, children }) => (
  <div ref={innerRef} {...innerProps}>
    {children}
    <Button
      className={styles.buttonClose}
      Icon={<Svg img={cross} size={1} />}
      onClick={() => setIsMenuOpen(false)}
      variant="iconOnly"
    />
  </div>
);

const InputSelect: FC<InputSelectProps> = ({ options, onChange, selectedOption }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [_selectedOption, _setSelectedOption] = useState<SingleValue<Option>>(
    selectedOption || options[0],
  );

  const onOptionClick = (option: SingleValue<Option>): void => {
    _setSelectedOption(option);
    setIsMenuOpen(false);

    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div>
      <Select
        classNamePrefix="InputSelect"
        components={{
          MenuList: args => <CustomMenu {...args} setIsMenuOpen={setIsMenuOpen} />,
          Option: CustomOption,
        }}
        isSearchable={false}
        menuIsOpen={isMenuOpen}
        onChange={option => onOptionClick(option)}
        onMenuOpen={() => setIsMenuOpen(true)}
        options={options}
        value={_selectedOption}
      />
    </div>
  );
};

export default InputSelect;
