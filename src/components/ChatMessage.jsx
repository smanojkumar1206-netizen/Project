import React from "react";
import { Bot, User, Volume2, ArrowRight, CheckCircle2, XCircle, Database, Cpu } from "lucide-react";

export function ChatMessage({
  message,
  onSpeak,
  onNavigate,
  onConfirmAction,
  onCancelAction
}) {
  const isUser = message.sender === "user";

  return (
    <div className={`chatBubbleWrapper ${isUser ? "userBubble" : "aiBubble"}`}>
      <div className="avatarBox">
        {isUser ? <User size={16} /> : <Bot size={18} />}
      </div>

      <div className="bubbleContent">
        <div className="bubbleHeader">
          <span className="senderName">{isUser ? "You" : "AgriAI 🌾"}</span>
          <span className="timestamp">{message.time || "Just now"}</span>
        </div>

        <div className="bubbleBody">
          <p>{message.text}</p>
        </div>

        {/* AI Tool Execution Chip */}
        {!isUser && message.tool_used && (
          <div className="toolBadgeRow">
            <span className="toolChip">
              <Cpu size={11} /> Tool: {message.tool_used}
            </span>
            {message.is_demo_data && (
              <span className="demoChip" title="Demonstration mode data">
                <Database size={10} /> Demo Data
              </span>
            )}
          </div>
        )}

        {/* Action Confirmation Cards */}
        {!isUser && message.action_required && !message.confirmed && !message.cancelled && (
          <div className="confirmationCard">
            <p className="confirmHint">⚠️ Please confirm this action to update AgriConnect database:</p>
            <div className="confirmActions">
              <button
                type="button"
                className="confirmBtn approve"
                onClick={() => onConfirmAction && onConfirmAction(message)}
              >
                <CheckCircle2 size={14} /> Confirm & Submit
              </button>
              <button
                type="button"
                className="confirmBtn cancel"
                onClick={() => onCancelAction && onCancelAction(message)}
              >
                <XCircle size={14} /> Cancel
              </button>
            </div>
          </div>
        )}

        {/* Action Status after Confirmation */}
        {!isUser && message.confirmed && (
          <div className="actionSuccessTag">
            <CheckCircle2 size={13} /> Action Confirmed & Created in AgriConnect!
          </div>
        )}
        {!isUser && message.cancelled && (
          <div className="actionCancelTag">
            <XCircle size={13} /> Action Cancelled.
          </div>
        )}

        {/* Footer Actions: Replay Voice & Navigate Button */}
        {!isUser && (
          <div className="bubbleFooter">
            <button
              type="button"
              className="speakReplayBtn"
              onClick={() => onSpeak && onSpeak(message.text, message.language)}
              title="Replay Voice Response"
            >
              <Volume2 size={13} /> Listen
            </button>

            {message.nav_target && (
              <button
                type="button"
                className="navActionBtn"
                onClick={() => onNavigate && onNavigate(message.nav_target)}
              >
                {message.action_button_label || `Go to ${message.nav_target}`} <ArrowRight size={13} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
