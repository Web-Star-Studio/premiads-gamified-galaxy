
export interface Message {
  id: number;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}
