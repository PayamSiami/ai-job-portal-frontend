export const formatSalary = (min: number, max?: number): string => {
  const formatter = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (max === undefined || max === min) {
    return formatter.format(min);
  }
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

export const getExperienceLabel = (level: string): string => {
  const labels: Record<string, string> = {
    entry: "کارآموز",
    mid: "متوسط",
    senior: "ارشد",
    lead: "رهبر تیم",
  };
  return labels[level] || level;
};

export const getWorkModeLabel = (mode: string): string => {
  const labels: Record<string, string> = {
    remote: "Remote",
    hybrid: "Hybrid",
    "on-site": "On-Site",
  };
  return labels[mode] || mode;
};

export const getJobTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    internship: "Internship",
  };
  return labels[type] || type;
};
