import React, { useCallback } from "react";
import { FlatListProps, RefreshControl, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { PullArrowIndicator } from "./PullArrowIndicator";

type PullToRefreshListProps<T> = Omit<FlatListProps<T>, "refreshControl"> & {
  isRefreshing: boolean;
  onRefresh: () => void;
};

const ReanimatedFlatList = Animated.FlatList as unknown as <T>(
  props: FlatListProps<T> & { ref?: React.Ref<Animated.FlatList<T>> },
) => React.ReactElement;

export function PullToRefreshList<T>({
  isRefreshing,
  onRefresh,
  onScroll,
  ...flatListProps
}: PullToRefreshListProps<T>) {
  const pullDistance = useSharedValue(0);

  const handleScroll = useCallback(
    (event: Parameters<NonNullable<typeof onScroll>>[0]) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      pullDistance.value = offsetY < 0 ? -offsetY : 0;
      onScroll?.(event);
    },
    [onScroll, pullDistance],
  );

  return (
    <View style={{ flex: 1 }}>
      <View
        pointerEvents="none"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <PullArrowIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
        />
      </View>

      <ReanimatedFlatList
        {...flatListProps}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            style={{ backgroundColor: "transparent" }}
          />
        }
      />
    </View>
  );
}
