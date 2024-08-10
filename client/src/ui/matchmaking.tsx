import { Text, Container } from '@react-three/uikit'
import { Button } from '../components/default/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/default/card.js'



export function CardDemo() {
  return (
    <Card width={380} height={300}>
      <CardHeader>
        <CardTitle>
          <Text>Notifications</Text>
        </CardTitle>
        <CardDescription>
          <Text>You have 3 unread messages.</Text>
        </CardDescription>
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
        <Button flexDirection="row" width="100%">
          <Text>Mark all as read</Text>
        </Button>
      </CardFooter>
    </Card>
  )
}
