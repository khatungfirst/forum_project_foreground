//防抖的函数
// 定义 debounce 函数的类型
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>): void => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func.apply(this, args); // 这里的 this 仍然可能是隐式的 any，但如果从外部捕获，则不是问题
        }, wait);
    };
};
