/* eslint-disable @typescript-eslint/no-explicit-any */
export const timeAgo = (date:any)=> {
    const now:any = new Date();
    const time:any = new Date(date);
    const seconds = Math.floor((now - time) / 1000);
  
    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];
  
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
  
    return "just now";

}