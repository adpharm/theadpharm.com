function LookingForMoreFunGames() {
  return (
    <div className="grid pt-4 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <div className="space-y-4">
        <a href="/digital/21Questions">
          <img src="/21QuestionsCard.webp" className="" />
          <p className="pt-2 font-medium">
            Play 21 Questions against the AI (Holiday Edition)
          </p>
        </a>
      </div>
      <div className="space-y-4">
        <a href="/digital/plinko">
          <img src="/plinkoCard.webp" className="" />
          <p className="pt-2 font-medium">Holiday Plinko</p>
        </a>
      </div>
    </div>
  );
}

export default LookingForMoreFunGames;
