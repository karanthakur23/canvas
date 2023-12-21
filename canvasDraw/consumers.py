import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CanvasConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print('Connection OPENED')

        await self.channel_layer.group_add(
            'drawing_group',
            self.channel_name
        )

    async def disconnect(self, close_code):
        print('Connection Closed!')
        await self.channel_layer.group_discard(
            'drawing_group',
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data['action']
        print('receiver Wroking')

        if action == 'draw':
            x = data.get('x')
            y = data.get('y')

            await self.channel_layer.group_send(
                'drawing_group',
                {
                    'type': 'draw_message',
                    'x': x,
                    'y': y
                }
            )

    async def draw_message(self, event):
        x = event['x']
        y = event['y']
        print("DRAW MESSAGE")

        await self.send(text_data=json.dumps({
            'x': x,
            'y': y
        }))

        print('DONE')