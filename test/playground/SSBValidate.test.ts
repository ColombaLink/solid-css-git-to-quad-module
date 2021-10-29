import * as ssbValidate from "ssb-validate"

describe('Playground for SSB Validate', () => {
    const key = {
        curve: 'ed25519',
        public: 'LGkKhMHc+8KZdqJRurtRwqQ+UVjtZOXCuxsZo6oYn/8=.ed25519',
        private: 'GAOJsSZYW/7W02/fYSdLU5evPgF31zY2vK/kgUO3y4EsaQqEwdz7wpl2olG6u1HCpD5RWO1k5cK7Gxmjqhif/w==.ed25519',
        id: '@LGkKhMHc+8KZdqJRurtRwqQ+UVjtZOXCuxsZo6oYn/8=.ed25519'
    }

    it('Create a feed and append messages', async(): Promise<void> => {
        var state = ssbValidate.initial()
        const validMsg = ssbValidate.create(null, key, null, {type: 'test'}, new Date())
        expect(validMsg).toBeDefined()
        const s2 = ssbValidate.append(state, null, validMsg)
        expect(s2).toBeDefined()

        const validMsg2 = ssbValidate.create(state, key, null, {type: 'test1'}, new Date())
        const s3 = ssbValidate.append(state, null, validMsg2)
        expect(s3).toBeDefined()

    });
})
