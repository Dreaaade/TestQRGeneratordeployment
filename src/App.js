import React, { useState } from "react";
import { QRCode } from "react-qrcode-logo";

export default function QRCodeGenerator() {
  const [attendees, setAttendees] = useState([]);
  const [csvData, setCsvData] = useState("");

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").slice(1); // Skip header
      const data = rows.map((row) => {
        const [id, firstName, lastName, branch, registrationDate] =
          row.split(",");
        return { id, firstName, lastName, branch, registrationDate };
      });
      setAttendees(data);
    };
    reader.readAsText(file);
  };

  const exportCSV = () => {
    const header = "ID,First Name,Last Name,Branch,Registration Date\n";
    const csvContent = attendees
      .map(
        (a) =>
          `${a.id},${a.firstName},${a.lastName},${a.branch},${a.registrationDate}`
      )
      .join("\n");
    const blob = new Blob([header + csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendees_with_qr.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">QR Code Generator</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleCsvUpload}
        className="mb-4"
      />
      {attendees.length > 0 && (
        <div>
          <button
            onClick={exportCSV}
            className="mb-4 bg-blue-500 text-white p-2 rounded"
          >
            Export CSV
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendees.map((attendee) => (
              <div key={attendee.id} className="p-2 border rounded-lg">
                <QRCode
                  value={`${attendee.id},${attendee.firstName},${attendee.lastName},${attendee.branch},${attendee.registrationDate}`}
                  size={128}
                />
                <p className="text-center mt-2">{`${attendee.firstName} ${attendee.lastName}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
