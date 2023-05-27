export class ChatGpt {
  public constructor(private apiKey: string) { }

  public async ask(question: string): Promise<string> {
    const res = await this.request("/chat/completions",
      "POST",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: question,

          }
        ]
      }
    )
    return res.choices[0].message.content
  }

  public async processData(data: string) {
    const res = await this.request("/completions", "POST", {
      model: "text-davinci-003",
      prompt: data,
    })

    return res.choices[0].text
  }

  public async parseAdvisory(advDescription: string) {
    //     const prompt = `I'm going to provide you with a vulnerability advisory description.
    // I want you to parse the text that I provide and extract the name of the vulnerable method, and the file in the where the vulnerability is. You need to return your findings in a JSON format with the fields 'file' and 'method' but you need to follow these conditions:
    // - you should never use your knowledge about the advisory that i provide. All the info you give me needs to come from the description i provide to you
    // - the method name is a single word and needs  to be between quotes, marked as bold, or in a code block (with markdown notation), if not ignore it
    // - the file path needs to end with a file extension, if not ignore it
    // - Don't return values in the json that are not specifically written in the text i provide to you

    // If you can't find a field value based on these restrictions leave that field in the json as null
    // Remember that you need to provide a json formatted response, without any other text, and without any feedback about your answer. Your full answer needs to be parsable as json
    // Here's the CVE:`
    //     advDescription + "\n"

    const prompt = `i'll provide you with a vulnerability advisory. It may or may not have specified the name of the vulnerable method. I want you to see if the method is explicitly mentioned there, and if it is to retrieve it. The method name is a single word, and will most likely be between quotes or between a markdown tag.
Your response needs to be only the method name in case you find it. If you don't find it reply with '.' . You cannot answer anything else besides the method name or the '.'

    advisory:

    ${advDescription}`


    // const prompt = "I'm going to provide you with a CVE description. " +
    //   "I want you to analyze that text and provide me a json object " +
    //   " with the vulnerable file path in a field called 'file'" +
    //   " and vulnerable method name in a field called 'method'. " +
    //   " The method name needs to be a single word and be either between quotes or a markdown tag, if not return the method name field as null." +
    //   " The vulnerable file path should end with a file extension if not return the field as null. " +
    //   " If you can't a field leave it as  null." +
    //   " Dont give me any feedback, and don't explain me your answer. :\n" +
    //   advDescription + "\n"

    return await this.ask(prompt) as any
  }

  private async request(relative_path: string, method: string, body: any): Promise<any> {
    const headers = {
      authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    }

    return new Promise((resolve, reject) => {
      fetch(`https://api.openai.com/v1${relative_path}`, {
        method,
        headers,
        body: JSON.stringify(body)
      })
        .then(res => resolve(res.json()))
        .catch(err => reject(err))
    })

  }
}
