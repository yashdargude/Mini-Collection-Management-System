import React, { useEffect, useRef, useState } from "react";
import { Invoicesdownload, RaInvoicesdownload } from "../api/dashboard";
import Notify from "./Notification";

function DropDown({ pos = "b", children, options, Item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (open) {
      window.addEventListener("click", (e) => {
        if (ref.current !== null && !ref.current.contains(e.target)) {
          setOpen(false);
        }
      });
    }
  }, [open]);

  return (
    <div className={"relative flex"}>
      <div onClick={() => setOpen(!open)} ref={ref}>
        {children}
      </div>
      {open && (
        <div
          className={`absolute z-50 flex min-w-40 flex-col overflow-hidden rounded-lg border shadow-sm ${
            pos === "b" ? "right-0 top-0" : "left-0 top-0"
          } border-gray-200`}
        >
          {Object.keys(options).map((k, index) => {
            return <Item docKey={k} name={options[k]} _in={index} key={k} />;
          })}
        </div>
      )}
    </div>
  );
}

const documentTypes = {
  invoice: {
    invoice: "Invoice",
    bol: "Bill of Lading",
    contract: "Contract",
  },
  "ra-analysis": {
    invoice: "Invoice",
    ra: "Remittance Advice",
    da: "Distribution Agreement",
    po: "Purchase Order",
  },
};

const DocumentDownload = ({ invoice, category = "invoice" }) => {
  console.log("DocumentDownload called with category:", category);

  const handleDownload = async (docType) => {
    console.log("Handling download for category:", category);
    console.log("Invoice data:", invoice); // Debug log to see invoice data

    // Check for invoice ID based on category
    const docId =
      category === "ra-analysis" ? invoice.ra_doc_id : invoice.doc_id;

    if (!docId) {
      Notify("Invalid document ID", "error");
      return;
    }

    try {
      let status, response;

      if (category === "ra-analysis") {
        [status, response] = await RaInvoicesdownload(docId);
      } else {
        [status, response] = await Invoicesdownload(docId);
      }

      // Check if the response indicates success
      if (status === 200) {
        if (response.success === false) {
          throw new Error(response.message || "Failed to retrieve document");
        }

        if (response.data?.urls && response.data.urls[docType]) {
          const url = response.data.urls[docType];
          window.open(url, "_blank");
          Notify(
            `Opening ${documentTypes[category][docType]} document in new tab`,
            "success",
          );
        } else {
          Notify(
            `No ${documentTypes[category][docType]} document available`,
            "error",
          );
        }
      } else {
        throw new Error("Failed to retrieve document");
      }
    } catch (error) {
      console.error("Download error:", error);
      Notify(error.message || "Failed to download document", "error");
    }
  };

  return (
    <DropDown
      options={documentTypes[category]}
      Item={({ docKey, name }) => (
        <div
          onClick={() => handleDownload(docKey)}
          className="flex cursor-pointer items-center gap-2 border-b bg-white px-4 py-2 text-xs hover:bg-gray-100"
        >
          <span className="material-symbols-rounded text-sm">description</span>
          <span>{name}</span>
        </div>
      )}
    >
      <span
        className="material-symbols-rounded cursor-pointer text-lg"
        title="Download Documents"
      >
        download
      </span>
    </DropDown>
  );
};

const RAAnalysisDownload = ({ invoice }) => {
  console.log("RAAnalysisDownload called", invoice);
  return <DocumentDownload invoice={invoice} category="ra-analysis" />;
};

export { DocumentDownload, DropDown, RAAnalysisDownload };
