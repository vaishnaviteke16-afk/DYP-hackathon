import Header from "../components/Header";

export default function Messages() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r p-4">
          <input
            placeholder="Search messages..."
            className="w-full p-2 border rounded mb-4"
          />

          <div className="space-y-3">
            <div className="p-3 bg-gray-100 rounded-lg cursor-pointer">
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-sm text-gray-500">
                Thanks! I'll review...
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">

          <div className="p-4 border-b font-semibold">
            Sarah Johnson
          </div>

          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            <div className="bg-blue-500 text-white p-3 rounded-lg w-fit ml-auto">
              Here's my proposal...
            </div>

            <div className="bg-gray-200 p-3 rounded-lg w-fit">
              Thanks! I'll review it.
            </div>
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              className="flex-1 border p-2 rounded"
              placeholder="Type your message..."
            />
            <button className="bg-blue-600 text-white px-4 rounded">
              Send
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}