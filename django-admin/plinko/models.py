from django.db import models


class Game(models.Model):
    """
    A single game of Plinko
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE)
    score = models.IntegerField()

    # a game has 1 board
    board = models.OneToOneField("Board", on_delete=models.CASCADE)

    def __str__(self):
        return f"Game {self.id} by {self.user.email}"


class Round(models.Model):
    """
    A single round of Plinko
    """

    class RoundNames(models.TextChoices):
        """
        Names for the rounds
        """
        ROUND1 = "round1", "Round 1"
        ROUND2 = "round2", "Round 2"
        ROUND3 = "round3", "Round 3"
        ROUND4 = "round4", "Round 4"
        ROUND5 = "round5", "Round 5"
        ROUND6 = "round6", "Round 6"
        ROUND7 = "round7", "Round 7"
        ROUND8 = "round8", "Round 8"
        ROUND9 = "round9", "Round 9"
        ROUND10 = "round10", "Round 10"

    key = models.CharField(max_length=50, choices=RoundNames.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    score = models.IntegerField()

    class Meta:
        ordering = ["game", "key"]
        unique_together = ["key", "game"]

    def __str__(self):
        return f"Round {self.key} in Game {self.game.id}"


class Board(models.Model):
    """
    A single board of Plinko
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Board {self.id}"


class Pocket(models.Model):
    """
    A single pocket on a board
    """

    class PocketNames(models.TextChoices):
        """
        Names for the pockets
        """
        ONE = "one", "One"
        TWO_A = "two_a", "Two A"
        TWO_B = "two_b", "Two B"
        THREE_A = "three_a", "Three A"
        THREE_B = "three_b", "Three B"
        FOUR_A = "four_a", "Four A"
        FOUR_B = "four_b", "Four B"
        FIVE_A = "five_a", "Five A"
        FIVE_B = "five_b", "Five B"

    class PocketValues(models.IntegerChoices):
        """
        Values for the pockets
        """
        ZERO = 0, "Zero"
        HUNDRED = 100, "Hundred"
        FIVE_HUNDRED = 500, "Five Hundred"
        ONE_THOUSAND = 1000, "One Thousand"
        TEN_THOUSAND = 10000, "Ten Thousand"

    class PocketPowerUps(models.TextChoices):
        """
        Powerups for the pockets
        """
        NONE = "none", "None"
        DOUBLE = "double", "Double"

    key = models.CharField(max_length=50, choices=PocketNames.choices)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    # integer choices isn't a thing in drizzle
    value = models.IntegerField(choices=PocketValues.choices)
    power_up = models.CharField(
        max_length=50, choices=PocketPowerUps.choices, default=PocketPowerUps.NONE)

    class Meta:
        ordering = ["board", "key"]
        unique_together = ["key", "board"]

    def __str__(self):
        return f"Pocket {self.key} on Board {self.board.id}"
