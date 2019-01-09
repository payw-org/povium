export const Example = {
	title: "Blockchain Is a Semantic WasteLand",
	subtitle: "this is subtitle",
	body: "",
	contents: [
		{
			type: "image",
			size: "",
			url: "/assets/images/post-test-img-4.jpg",
			captionEnabled: false
		},
		{
			type: "p",
			data: [
				{
					"type": "styledText",
					"data": [
						{
							"type": "styledText",
							"data": [
								{
									"type": "rawText",
									"data": "second <u>bold</u>merging bold part second "
								}
							],
							"style": "italic"
						}
					],
					"style": "bold"
				},
			]
		},
		{
			type: "p",
			data: [
				{
					"type": "styledText",
					"data": [
						{
							"type": "rawText",
							"data": "second "
						},
						{
							"type": "styledText",
							"data": [
								{
									"type": "rawText",
									"data": "merging"
								}
							],
							"style": "italic"
						},
						{
							"type": "rawText",
							"data": " bold part second "
						}
					],
					"style": "bold"
				}
			]
		},
		{
			type: "image",
			size: "",
			url: "/assets/images/post-test-img.gif",
			captionEnabled: true,
			caption: {
				data: [
					{
						"type": "rawText",
						"data": "This is an image caption."
					}
				]
			}
		},
		{
			type: "blockquote",
			data: [
				{
					type: "rawText",
					data: "The reason “blockchain” is such seductive marketing… is the subtle implication that the data structure alone — absent proof of work or open validation — could convey the same benefits as bitcoin."
				}
			],
			kind: "bar"
		}
	],
	isPremium: true
}
