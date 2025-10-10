// 🔧 配置表
const addressFormatRules = {
    ethereum: { prefix: 6, suffix: 4 },
    tron: { prefix: 6, suffix: 4 },
    bitcoin: { prefix: 4, suffix: 4 },
    solana: { prefix: 6, suffix: 6 },
    cosmos: { prefix: 6, suffix: 6 },
    polkadot: { prefix: 6, suffix: 6 },
    ripple: { prefix: 6, suffix: 6 },
    cardano: { prefix: 6, suffix: 6 },
    tezos: { prefix: 6, suffix: 6 },
    near: { prefix: 6, suffix: 6, keepFullIfShort: 15 }, // 短用户名直接显示
    generic: { prefix: 6, suffix: 4 },
};
/**
 * 格式化地址字符串
 *
 * @param address 地址字符串
 * @param chain 链类型，默认值为 "ethereum"
 * @returns 格式化后的地址字符串
 */
function formatAddress(address, chain = "ethereum") {
    if (!address)
        return "";
    const rule = addressFormatRules[chain] || addressFormatRules["generic"];
    if (rule.keepFullIfShort && address.length <= rule.keepFullIfShort) {
        return address;
    }
    if (address.length <= rule.prefix + rule.suffix) {
        return address; // 避免过度截断
    }
    return address.slice(0, rule.prefix) + "..." + address.slice(-rule.suffix);
}

/**
 * 补零函数
 */
function padZero(num, length = 2) {
    return num.toString().padStart(length, "0");
}
/**
 * 解析输入时间为 Date 对象
 */
function parseTime(time) {
    if (time instanceof Date) {
        return time;
    }
    if (typeof time === "number") {
        return new Date(time);
    }
    return new Date(time);
}
/**
 * 格式化相对时间（例如：刚刚、1分钟前、1小时前等）
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (seconds < 60) {
        return "刚刚";
    }
    if (minutes < 60) {
        return `${minutes}分钟前`;
    }
    if (hours < 24) {
        return `${hours}小时前`;
    }
    if (days < 30) {
        return `${days}天前`;
    }
    if (months < 12) {
        return `${months}个月前`;
    }
    return `${years}年前`;
}
/**
 * 根据自定义格式字符串格式化时间
 */
function formatCustom(date, formatStr) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return formatStr
        .replace(/YYYY/g, year.toString())
        .replace(/MM/g, padZero(month))
        .replace(/DD/g, padZero(day))
        .replace(/HH/g, padZero(hours))
        .replace(/mm/g, padZero(minutes))
        .replace(/ss/g, padZero(seconds));
}
/**
 * 格式化时间
 *
 * @param time - 时间输入（Date 对象、时间戳或日期字符串）
 * @param options - 格式化选项
 * @returns 格式化后的时间字符串
 *
 * @example
 * ```ts
 * formatTime(new Date()) // "2025-10-10 22:00:00" (默认格式)
 * formatTime(Date.now(), { format: "YYYY-MM-DD" }) // "2025-10-10"
 * formatTime(new Date(), { format: "relative" }) // "刚刚"
 * formatTime(new Date(), { format: "custom", customFormat: "YYYY年MM月DD日 HH:mm" }) // "2025年10月10日 22:00"
 * ```
 */
function formatTime(time, options = {}) {
    const { format = "YYYY-MM-DD HH:mm:ss", customFormat } = options;
    try {
        const date = parseTime(time);
        if (Number.isNaN(date.getTime())) {
            return "";
        }
        // 相对时间格式
        if (format === "relative") {
            return formatRelativeTime(date);
        }
        // 自定义格式
        if (format === "custom" && customFormat) {
            return formatCustom(date, customFormat);
        }
        // 预定义格式
        const year = date.getFullYear();
        const month = padZero(date.getMonth() + 1);
        const day = padZero(date.getDate());
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        const seconds = padZero(date.getSeconds());
        switch (format) {
            case "YYYY-MM-DD":
                return `${year}-${month}-${day}`;
            case "YYYY-MM-DD HH:mm:ss":
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            case "YYYY/MM/DD":
                return `${year}/${month}/${day}`;
            case "YYYY/MM/DD HH:mm:ss":
                return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
            case "MM-DD HH:mm":
                return `${month}-${day} ${hours}:${minutes}`;
            case "HH:mm:ss":
                return `${hours}:${minutes}:${seconds}`;
            default:
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }
    catch (error) {
        console.warn("Error formatting time:", error);
        return "";
    }
}

var index = { formatAddress, formatTime };

export { index as default };
//# sourceMappingURL=index.esm.js.map
