import { useState } from "react";

export default function LiveDateTime() {
  const [currentDateTime] = useState(
    getFormattedDateTime()
  );

  return <span className="text-sm md:text-base">{currentDateTime}</span>;
}

// Fungsi untuk mendapatkan format Tanggal + Jam
function getFormattedDateTime() {
  const now = new Date();

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  // const formattedTime = now.toLocaleTimeString("id-ID", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // });

  return `${formattedDate}`;
}
