import { useEffect, useState } from "react";
import { Mail, CheckCircle, Trash2, Eye, EyeOff, Loader, Inbox } from "lucide-react";
import useContactStore from "../store/contactStore.js";

export default function Contacts() {
  const { contacts, loading, error, fetchContacts, toggleRead, deleteContact } = useContactStore();
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleToggleRead = async (id, currentReadState) => {
    const res = await toggleRead(id, !currentReadState);
    if (!res.success) alert(res.message);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this message?")) {
      const res = await deleteContact(id);
      if (res.success) {
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert(res.message);
      }
    }
  };

  const handleSelectMessage = (contact) => {
    setSelectedMessage(contact);
    if (!contact.isRead) {
      handleToggleRead(contact._id, false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Mail className="h-6 w-6 text-violet-600" />
          Contact Inbox
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Read and manage queries sent by visitors from the public website contact form.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && contacts.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-350 bg-white text-slate-400">
          <Inbox className="h-12 w-12 text-slate-300 mb-2" />
          <p className="font-semibold text-sm">Inbox is empty</p>
          <p className="text-xs text-slate-400 mt-1">No contact submissions found in database.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left: Message list */}
          <div className="lg:col-span-2 space-y-3 overflow-y-auto max-h-[600px] pr-1">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                onClick={() => handleSelectMessage(contact)}
                className={`rounded-xl border p-4 cursor-pointer text-left transition duration-200 ${
                  selectedMessage?._id === contact._id
                    ? "border-blue-500 bg-blue-50/20 shadow-sm"
                    : contact.isRead
                      ? "border-slate-200 bg-white hover:bg-slate-50"
                      : "border-blue-100 bg-blue-500/[0.02] hover:bg-blue-500/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm truncate ${contact.isRead ? "font-semibold text-slate-700" : "font-extrabold text-slate-900"}`}>
                    {contact.name}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-xs mt-1 truncate ${contact.isRead ? "text-slate-500" : "font-bold text-slate-700"}`}>
                  {contact.subject}
                </p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {contact.message}
                </p>
                
                {/* Visual marker for unread */}
                {!contact.isRead && (
                  <span className="mt-2.5 inline-block h-2 w-2 rounded-full bg-blue-600"></span>
                )}
              </div>
            ))}
          </div>

          {/* Right: Message Detail Viewer */}
          <div className="lg:col-span-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px] flex flex-col">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  {/* Sender Header details */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-4 gap-4">
                    <div>
                      <h3 className="font-black text-slate-800 text-base leading-tight">
                        {selectedMessage.subject}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600 mt-1">
                        From: {selectedMessage.name} &bull; <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:underline">{selectedMessage.email}</a>
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold shrink-0">
                      Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div className="rounded-xl bg-slate-50 p-5 border border-slate-100 min-h-[150px]">
                    <p className="text-sm leading-relaxed text-slate-750 font-medium whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Bottom Message Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage._id, selectedMessage.isRead)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-bold transition duration-200 ${
                        selectedMessage.isRead
                          ? "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {selectedMessage.isRead ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Mark as Unread
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Mark as Read
                        </>
                      )}
                    </button>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 transition"
                    >
                      Reply by Email
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition duration-200"
                    title="Delete Message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <CheckCircle className="h-10 w-10 text-slate-350 mb-2" />
                <p className="text-sm font-semibold">No message selected</p>
                <p className="text-xs text-slate-400 mt-1">Select a message from the list on the left to read.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
