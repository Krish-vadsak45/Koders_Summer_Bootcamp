import { Coin, CoinHistory } from "@/types";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function getCoins(
  vsCurrency: string = "usd",
  perPage: number = 50,
  page: number = 1
): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coins");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching coins:", error);
    throw error;
  }
}

export async function searchCoins(query: string): Promise<Coin[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&ids=${query}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
    );

    if (!response.ok) {
      throw new Error("Failed to search coins");
    }

    return response.json();
  } catch (error) {
    console.error("Error searching coins:", error);
    throw error;
  }
}

export async function getCoinHistory(
  coinId: string,
  days: number = 7
): Promise<CoinHistory> {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coin history");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching coin history:", error);
    throw error;
  }
}
