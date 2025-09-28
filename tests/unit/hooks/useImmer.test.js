// 测试 useImmer hook
import { renderHook, act } from "@testing-library/react";
import { useImmer } from "../../../src/hooks/useImmer";

describe("useImmer hook", () => {
  test("initializes with default value correctly", () => {
    const { result } = renderHook(() => useImmer({ count: 0 }));
    const [state] = result.current;

    expect(state.count).toBe(0);
  });

  test("updates state immutably using produce function", () => {
    const { result } = renderHook(() => useImmer({ count: 0 }));
    const [, updateState] = result.current;

    // 初始状态检查
    expect(result.current[0].count).toBe(0);

    // 模拟更新状态 - 使用 act 包装状态更新操作
    act(() => {
      updateState((draft) => {
        draft.count += 1;
      });
    });

    // 检查更新后的状态
    expect(result.current[0].count).toBe(1);
  });

  test("can update state multiple times", () => {
    const { result } = renderHook(() => useImmer({ count: 0 }));
    const [, updateState] = result.current;

    // 第一次更新
    act(() => {
      updateState((draft) => {
        draft.count += 1;
      });
    });
    expect(result.current[0].count).toBe(1);

    // 第二次更新
    act(() => {
      updateState((draft) => {
        draft.count += 2;
      });
    });
    expect(result.current[0].count).toBe(3);
  });
});
