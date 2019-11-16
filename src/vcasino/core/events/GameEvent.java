package vcasino.core.events;

import vcasino.core.Player;

public abstract class GameEvent {

	protected Player eventOwner;
	
	private String action;
	private int cardID;
	
	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public int getCardID() {
		return cardID;
	}

	public void setCardID(int cardID) {
		this.cardID = cardID;
	}

	public GameEvent(Player by) {
		eventOwner = by;
	}
	
	public abstract String toJSONString();
}