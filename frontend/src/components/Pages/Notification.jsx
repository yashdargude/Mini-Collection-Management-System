import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

function Notification({
  id = crypto.randomUUID(),
  message = "Hello World",
  tempo = "info",
}) {
  return (
    <div
      id={id}
      role="alert"
      aria-live="polite"
      className={`notification ${
        tempo === "info"
          ? "notification-info"
          : tempo === "success"
            ? "notification-success"
            : "notification-alert"
      }`}
    >
      <div className="flex items-center gap-4 font-semibold">
        <span
          className="material-symbols-rounded text-md"
          style={{ fontFamily: "Material Symbols Rounded" }}
        >
          {tempo === "info"
            ? "info"
            : tempo === "success"
              ? "check_circle"
              : "warning"}
        </span>
        <span className="text-sm">{message}</span>
      </div>
      <button
        className="material-symbols-rounded text-md"
        aria-label="Close notification"
        style={{ fontFamily: "Material Symbols Rounded" }}
      >
        close
      </button>
    </div>
  );
}

let currentNotificationTimer = null;
let lastNotificationRequest = null;

function Notify(message, tempo, duration = 3000) {
  // Clear any pending notification timer
  if (currentNotificationTimer) {
    clearTimeout(currentNotificationTimer);
  }

  // Store this notification request
  lastNotificationRequest = { message, tempo, duration };

  // Use requestAnimationFrame to batch rapid notifications
  requestAnimationFrame(() => {
    // Only show notification if it's still the latest request
    if (
      lastNotificationRequest.message === message &&
      lastNotificationRequest.tempo === tempo
    ) {
      showNotification(message, tempo, duration);
    }
  });
}

function showNotification(message, tempo, duration) {
  const notiStack = document.getElementById("notiStack");
  if (!notiStack) {
    console.error("Notification container not found");
    return;
  }

  // Clear existing notifications
  while (notiStack.firstChild) {
    notiStack.removeChild(notiStack.firstChild);
  }

  const id = crypto.randomUUID();
  const notification = renderToStaticMarkup(
    <Notification id={id} message={message} tempo={tempo} />,
  );

  const container = document.createElement("div");
  container.innerHTML = notification;
  const notificationElement = container.firstElementChild;
  notiStack.appendChild(notificationElement);

  const btn = notificationElement.querySelector("button");
  const removeNotification = () => {
    if (currentNotificationTimer) {
      clearTimeout(currentNotificationTimer);
      currentNotificationTimer = null;
    }
    notificationElement.remove();
  };

  btn.onclick = removeNotification;

  // Set new timer
  currentNotificationTimer = setTimeout(removeNotification, duration);

  return id;
}

export default Notify;
