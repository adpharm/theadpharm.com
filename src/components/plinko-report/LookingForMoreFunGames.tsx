function LookingForMoreFunGames() {
  return (
    <div className="flex gap-6 pt-6 flex-col md:flex-row">
      <div className="space-y-4 max-w-60">
        <a href="/digital/21Questions">
          <img src="/21QuestionsCard.webp" className="" />
          <p className="pt-2">21 Questions against the AI</p>
        </a>
      </div>
      <div className="space-y-4 max-w-60">
        <a href="/digital/plinko">
          <img src="/plinkoCard.webp" className="" />
          <p className="pt-2">Plinko (Adpharm Holiday Card 2024)</p>
        </a>
      </div>
    </div>
  );
}

export default LookingForMoreFunGames;