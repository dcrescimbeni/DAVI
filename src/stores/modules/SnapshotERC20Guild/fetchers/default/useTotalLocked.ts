import useTotalLockedAt from 'Modules/Guilds/Hooks/useTotalLockedAt';
import { useContractEvent, useContractRead } from 'wagmi';
import { BigNumber } from 'ethers';
import { BaseERC20Guild } from 'contracts/ts-files/BaseERC20Guild';
import { useHookStoreProvider } from 'stores';

export const useTotalLocked = (
  guildAddress: string,
  proposalId?: `0x${string}`
) => {
  const {
    hooks: {
      fetchers: { useSnapshotId },
    },
  } = useHookStoreProvider();

  const { data: snapshotId } = useSnapshotId({
    contractAddress: guildAddress,
    proposalId,
  });

  const {
    data: totalLockedResponse,
    refetch,
    ...totalLockedResponseRest
  } = useContractRead({
    address: guildAddress,
    abi: BaseERC20Guild.abi,
    functionName: 'getTotalLocked',
  });

  useContractEvent({
    address: guildAddress,
    abi: BaseERC20Guild.abi,
    eventName: 'TokensLocked',
    listener() {
      refetch();
    },
  });

  useContractEvent({
    address: guildAddress,
    abi: BaseERC20Guild.abi,
    eventName: 'TokensWithdrawn',
    listener() {
      refetch();
    },
  });

  const {
    data: totalLockedAtProposalSnapshotResponse,
    ...totalLockedAtProposalSnapshotResponseRest
  } = useTotalLockedAt({
    contractAddress: guildAddress,
    snapshotId: snapshotId?.toString() ?? null,
  });

  return snapshotId?.toString()
    ? {
        data: totalLockedAtProposalSnapshotResponse
          ? BigNumber.from(totalLockedAtProposalSnapshotResponse)
          : undefined,
        ...totalLockedAtProposalSnapshotResponseRest,
      }
    : {
        data: totalLockedResponse
          ? BigNumber.from(totalLockedResponse)
          : undefined,
        ...totalLockedResponseRest,
      };
};
