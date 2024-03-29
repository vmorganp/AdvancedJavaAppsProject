package vcasino.factory;
 
import vcasino.core.Ruleset;
import vcasino.core.games.GoFishRuleset;
import vcasino.core.games.PokerRuleset;
import vcasino.core.games.TexasHoldemRuleSet;
import vcasino.core.games.UnoRuleset;

/*
 * Factory to determine which ruleset to use for the game
 */
public class RulesetFactory {
	

	public static Ruleset getRuleset(String gameName) {
		switch (gameName) {
		case "holdem":
			return new TexasHoldemRuleSet();
		case "uno":
			return new UnoRuleset();
		case "gofish":
			return new GoFishRuleset();
		default:
			return new PokerRuleset();
		}
	}

}
