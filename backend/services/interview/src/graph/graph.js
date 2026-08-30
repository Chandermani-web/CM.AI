import { START, StateGraph, END } from "@langchain/langgraph";
import interviewState from "./state.js";
import { interviewNode, feedbackNode, summaryNode } from "./nodes.js";

function router(state) {
    switch (state.action) {
        case "start":
            return "interviewAgent";
        case "feedback":
            return "feedbackAgent";
        default:
            return END;
    }
}

function feedbackRouter(state) {
    switch (state.action) {
        case "summary":
            return "summaryAgent";
        default:
            return END;
    }
}

const graph = new StateGraph(interviewState)
// nodes
.addNode("interviewAgent", interviewNode)
.addNode("feedbackAgent", interviewNode)
.addNode("summaryAgent", summaryNode)
// condition start
.addConditionalEdges(
    START,
    router,
    {
        interviewAgent: "interviewAgent",
        feedbackAgent: "feedbackAgent",
    }
)
.addEdge("interviewAgent", END)
.addConditionalEdges(
    "feedbackAgent",
    feedbackRouter,
    {
        summaryAgent: "summaryAgent",
        [END]: END,
    }
)
.addEdge("summaryAgent", END)
.compile();

export default graph;