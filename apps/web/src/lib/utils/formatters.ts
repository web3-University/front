export const formatCourseDuration = (duration?: number) => {
  if (!duration || duration <= 0) return "未设置";
  if (duration > 600) {
    const hours = duration / 3600;
    if (hours >= 1) {
      const normalized =
        hours >= 10 ? Math.round(hours) : parseFloat(hours.toFixed(1));
      return `${normalized} 小时`;
    }
    return `${Math.max(1, Math.round(hours * 60))} 分钟`;
  }
  if (duration > 48) {
    const hours = duration / 60;
    if (hours >= 1) {
      const normalized =
        hours >= 10 ? Math.round(hours) : parseFloat(hours.toFixed(1));
      return `${normalized} 小时`;
    }
    return `${Math.max(1, Math.round(duration))} 分钟`;
  }
  const normalized =
    duration % 1 === 0 ? duration : parseFloat(duration.toFixed(1));
  return `${normalized} 小时`;
};

export const formatLessonDuration = (duration?: number) => {
  if (!duration || duration <= 0) return null;
  const isLikelySeconds = duration > 300;
  const minutes = isLikelySeconds ? duration / 60 : duration;
  if (minutes >= 60) {
    const hours = minutes / 60;
    const normalized =
      hours >= 10 ? Math.round(hours) : parseFloat(hours.toFixed(1));
    return `${normalized} 小时`;
  }
  return `${Math.max(1, Math.round(minutes))} 分钟`;
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("zh-CN").format(Number.isFinite(value) ? value : 0);

export const formatDate = (dateString?: string) => {
  if (!dateString) return "未知";
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
