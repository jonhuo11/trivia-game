import React from "react";
import ReactDOM from "react-dom/client";
import App from "./TriviaApp/App.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage.tsx";
import TriviaEditor from "./TriviaEditor/TriviaEditor.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
        errorElement: <ErrorPage/>
	},
    {
        path: "editor",
        element: <TriviaEditor/>
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
