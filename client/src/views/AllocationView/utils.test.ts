/* eslint-disable @typescript-eslint/naming-convention */
import { BigNumber } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import {
  getAllocationValuesInitialState,
  getAllocationValuesAfterManualChange,
  getAllocationValuesWithRewardsSplitted,
} from './utils';

describe('getAllocationValuesWithRewardsSplitted', () => {
  it('properly distributes the difference when sum is lower than restToDistribute', () => {
    expect(
      getAllocationValuesWithRewardsSplitted({
        allocationValues: [
          { address: '0xA', value: '0.2' },
          { address: '0xB', value: '0.3' },
          { address: '0xC', value: '0.5' },
        ],
        restToDistribute: parseUnits('2'),
      }),
    ).toEqual([
      { address: '0xA', value: '0.2' },
      { address: '0xB', value: '0.3' },
      { address: '0xC', value: '1.5' },
    ]);
  });

  it('properly distributes the difference when sum is lower than restToDistribute and last element cant fill the difference', () => {
    expect(
      getAllocationValuesWithRewardsSplitted({
        allocationValues: [
          { address: '0xA', value: '0.2' },
          { address: '0xB', value: '0.3' },
          { address: '0xC', value: '0' },
        ],
        restToDistribute: parseUnits('2'),
      }),
    ).toEqual([
      { address: '0xA', value: '1.7' },
      { address: '0xB', value: '0.3' },
      { address: '0xC', value: '0' },
    ]);
  });

  it('properly distributes the difference when sum is bigger than restToDistribute and last element can fill the difference', () => {
    expect(
      getAllocationValuesWithRewardsSplitted({
        allocationValues: [
          { address: '0xA', value: '1.0' },
          { address: '0xB', value: '2.0' },
          { address: '0xC', value: '4.5' },
        ],
        restToDistribute: parseUnits('5'),
      }),
    ).toEqual([
      { address: '0xA', value: '1.0' },
      { address: '0xB', value: '2.0' },
      { address: '0xC', value: '2.0' },
    ]);
  });

  it('properly distributes the difference when sum is bigger than restToDistribute and last element cant fill the difference', () => {
    expect(
      getAllocationValuesWithRewardsSplitted({
        allocationValues: [
          { address: '0xA', value: '1.0' },
          { address: '0xB', value: '4.5' },
          { address: '0xC', value: '0.5' },
        ],
        restToDistribute: parseUnits('5'),
      }),
    ).toEqual([
      { address: '0xA', value: '1.0' },
      { address: '0xB', value: '3.5' },
      { address: '0xC', value: '0.5' },
    ]);
  });

  it('returns empty array when given empty array', () => {
    expect(
      getAllocationValuesWithRewardsSplitted({
        allocationValues: [],
        restToDistribute: BigNumber.from(500),
      }),
    ).toEqual([]);
  });

  it('returns initial values when restToDistribute is zero', () => {
    expect(
      getAllocationValuesWithRewardsSplitted({
        allocationValues: [
          { address: '0xA', value: formatUnits(BigNumber.from(100)) },
          { address: '0xB', value: formatUnits(BigNumber.from(200)) },
          { address: '0xC', value: formatUnits(BigNumber.from(450)) },
        ],
        restToDistribute: BigNumber.from(0),
      }),
    ).toEqual([
      { address: '0xA', value: formatUnits(BigNumber.from(100)) },
      { address: '0xB', value: formatUnits(BigNumber.from(200)) },
      { address: '0xC', value: formatUnits(BigNumber.from(450)) },
    ]);
  });
});

describe('getAllocationValuesInitialState', () => {
  const propsCommon = {
    allocationValues: [
      { address: '0xA', value: '0.2' },
      { address: '0xB', value: '0.3' },
      { address: '0xC', value: '0.5' },
    ],
    allocations: ['0xA', '0xB', '0xC'],
    isManualMode: false,
    percentageProportions: {},
    rewardsForProposals: parseUnits('1'),
    shouldReset: false,
    userAllocationsElements: [],
  };

  describe('Case A (shouldReset, userAllocations provided)', () => {
    it('when allocations match userAllocationsElements', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          allocations: ['0xA', '0xB', '0xC'],
          isManualMode: true,
          rewardsForProposals: parseUnits('0.6'),
          shouldReset: true,
          userAllocationsElements: [
            { address: '0xA', value: '0.3' },
            { address: '0xB', value: '0.2' },
            { address: '0xC', value: '0.1' },
          ],
        }),
      ).toEqual([
        { address: '0xA', value: '0.3' },
        { address: '0xB', value: '0.2' },
        { address: '0xC', value: '0.1' },
      ]);
    });

    it('when allocations do not match userAllocationsElements', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          allocations: ['0xA', '0xB', '0xC', '0xD'],
          isManualMode: true,
          rewardsForProposals: parseUnits('0.6'),
          shouldReset: true,
          userAllocationsElements: [
            { address: '0xA', value: '0.3' },
            { address: '0xB', value: '0.2' },
            { address: '0xC', value: '0.1' },
          ],
        }),
      ).toEqual([
        { address: '0xA', value: '0.3' },
        { address: '0xB', value: '0.2' },
        { address: '0xC', value: '0.1' },
        { address: '0xD', value: '0' },
      ]);
    });
  });

  describe('Case B (shouldReset, userAllocations not provided)', () => {
    it('default', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          allocationValues: [
            { address: '0xA', value: '0.3' },
            { address: '0xB', value: '0.2' },
            { address: '0xC', value: '0.1' },
          ],
          isManualMode: false,
          rewardsForProposals: parseUnits('1'),
          userAllocationsElements: [],
        }),
      ).toEqual([
        { address: '0xA', value: '0.333333333333333333' },
        { address: '0xB', value: '0.333333333333333333' },
        { address: '0xC', value: '0.333333333333333334' },
      ]);
    });
  });

  describe('Case C (userAllocations.length === 0 && !isManualMode) ', () => {
    it('when isManualMode & !userAllocationsElements', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          isManualMode: false,
          userAllocationsElements: [],
        }),
      ).toEqual([
        { address: '0xA', value: '0.333333333333333333' },
        { address: '0xB', value: '0.333333333333333333' },
        { address: '0xC', value: '0.333333333333333334' },
      ]);
    });
  });

  describe('Case D (all the rest)', () => {
    it('when isManualMode, userAllocationsElements & allocationValues', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          allocationValues: [
            { address: '0xA', value: '0.2' },
            { address: '0xB', value: '0.3' },
            { address: '0xC', value: '0.5' },
          ],
          isManualMode: true,
          userAllocationsElements: [
            { address: '0xA', value: '0.5' },
            { address: '0xB', value: '0.3' },
            { address: '0xC', value: '0.2' },
          ],
        }),
      ).toEqual([
        { address: '0xA', value: '0.2' },
        { address: '0xB', value: '0.3' },
        { address: '0xC', value: '0.5' },
      ]);
    });

    it('when isManualMode, userAllocationsElements & !allocationValues', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          allocationValues: [],
          isManualMode: true,
          userAllocationsElements: [
            { address: '0xA', value: '0.5' },
            { address: '0xB', value: '0.3' },
            { address: '0xC', value: '0.2' },
          ],
        }),
      ).toEqual([
        { address: '0xA', value: '0.5' },
        { address: '0xB', value: '0.3' },
        { address: '0xC', value: '0.2' },
      ]);
    });

    it('when isManualMode, userAllocationsElements, allocationValues & percentageProportions', () => {
      expect(
        getAllocationValuesInitialState({
          ...propsCommon,
          allocationValues: [
            { address: '0xA', value: '0.2' },
            { address: '0xB', value: '0.3' },
            { address: '0xC', value: '0.5' },
          ],
          isManualMode: true,
          percentageProportions: {
            '0xA': 60,
            '0xB': 35,
            '0xC': 5,
          },
          userAllocationsElements: [
            { address: '0xA', value: '0.5' },
            { address: '0xB', value: '0.3' },
            { address: '0xC', value: '0.2' },
          ],
        }),
      ).toEqual([
        { address: '0xA', value: '0.6' },
        { address: '0xB', value: '0.35' },
        { address: '0xC', value: '0.05' },
      ]);
    });
  });
});

describe('getAllocationValuesAfterManualChange', () => {
  const propsCommon = {
    allocationValues: [
      { address: '0xA', value: '0.333333333333333333' },
      { address: '0xB', value: '0.333333333333333333' },
      { address: '0xC', value: '0.333333333333333334' },
    ],
    allocations: ['0xA', '0xB', '0xC'],
    individualReward: parseUnits('2'),
    isManualMode: false,
    newAllocationValue: {
      address: '0xA',
      value: '0.05',
    },
    rewardsForProposals: parseUnits('1'),
    setAddressesWithError: () => {},
  };

  it('!individualReward', () => {
    expect(
      getAllocationValuesAfterManualChange({ ...propsCommon, individualReward: undefined }),
    ).toEqual({
      allocationValuesArrayNew: [
        { address: '0xA', value: '0.333333333333333333' },
        { address: '0xB', value: '0.333333333333333333' },
        { address: '0xC', value: '0.333333333333333334' },
      ],
      rewardsForProposalsNew: parseUnits('1'),
    });
  });

  it('allocationValuesArrayNewSum.gt(individualReward)', () => {
    expect(
      getAllocationValuesAfterManualChange({
        ...propsCommon,
        newAllocationValue: {
          address: '0xA',
          value: '100',
        },
      }),
    ).toEqual({
      allocationValuesArrayNew: [
        { address: '0xA', value: '0' },
        { address: '0xB', value: '0.333333333333333333' },
        { address: '0xC', value: '0.333333333333333334' },
      ],
      rewardsForProposalsNew: parseUnits('1'),
    });
  });

  it('correctly updates allocationValues when !isManualMode', () => {
    expect(getAllocationValuesAfterManualChange(propsCommon)).toEqual({
      allocationValuesArrayNew: [
        { address: '0xA', value: '0.05' },
        { address: '0xB', value: '0.333333333333333333' },
        { address: '0xC', value: '0.616666666666666667' },
      ],
      rewardsForProposalsNew: parseUnits('1'),
    });
  });

  it('correctly updates allocationValues when isManualMode', () => {
    expect(
      getAllocationValuesAfterManualChange({
        ...propsCommon,
        isManualMode: true,
      }),
    ).toEqual({
      allocationValuesArrayNew: [
        { address: '0xA', value: '0.05' },
        { address: '0xB', value: '0.333333333333333333' },
        { address: '0xC', value: '0.333333333333333334' },
      ],
      rewardsForProposalsNew: parseUnits('0.716666666666666667'),
    });
  });
});
