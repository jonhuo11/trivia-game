import React from "react";
import ReactDOM from "react-dom/client";
import TriviaApp from "./TriviaApp/TriviaApp.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage.tsx";
import TriviaEditor from "./TriviaEditor/TriviaEditor.tsx";
import IndexLandingPageWrapper from "./Landing/IndexLanding.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexLandingPageWrapper/>,
        errorElement: <ErrorPage/>
    },
	{
		path: "play",
		element: <TriviaApp />,
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
