import { ReduxProvider } from "./providers";
import { BoardPage } from "@/components/board/BoardPage";

export default function Home() {
  return (
    <ReduxProvider>
      <BoardPage />
    </ReduxProvider>
  );
}
