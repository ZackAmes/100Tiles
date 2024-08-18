import { Text, Container } from '@react-three/uikit'
import { Button } from '../components/default/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/default/card.js'
import { useState } from 'react'
import { useComponentValue } from '@dojoengine/react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { useDojo } from '../dojo/useDojo.js';
import { Entity } from '@dojoengine/recs';

export function Matchmaking() {

  const {
    setup: {
        systemCalls: { create_game, join_game, start_game},
        clientComponents: { Game }
    },
    account,
} = useDojo();

  let [game_id, set_game] = useState(0);

  const gameId = getEntityIdFromKeys([BigInt(0)]) as Entity

  const game = useComponentValue(Game, gameId);



  console.log(game);

  return (
    <Card width={380} height={300}>
      <CardHeader>
        <CardTitle>
          <Text>Matchmaking</Text>
        </CardTitle>
      </CardHeader>
      <CardContent flexDirection="column" gap={16}>
        <Container flexDirection="row" alignItems="center" gap={16} borderRadius={6} borderWidth={1} padding={16}>
          <Container flexDirection="column" gap={4}>
            <Text fontSize={14} lineHeight="100%">
              Push Notifications
            </Text>
          </Container>
        </Container>
      </CardContent>
      <CardFooter>
        <Button flexDirection="row" width="100%" onClick={() => create_game(account.account)}>
          <Text> Join/Start </Text>
        </Button>
      </CardFooter>
    </Card>
  )
}
