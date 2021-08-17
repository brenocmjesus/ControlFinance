const Modal = {
        open() {
            // Abrir modal
            // Adicionar classe active ao modality
            document
                .querySelector('.modal-overlay')
                .classList
                .add('active')
        },
        close() {
            // Fechar Modal
            // Remover a classe active do modal
            document
                .querySelector('.modal-overlay')
                .classList
                .remove('active')
        }
    }
    //tooglo - função que liga e desliga algo.
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    income() {
        let income = 0;
        //pegar todas as transações -- => troca a palavra function, pode excluií-la
        //transactions.forEach(function(transaction){} ------função original
        // para cada (forEach) se ela for maior que zero somar a uma variável e retornar a variavel
        Transaction.all.forEach((transaction) => {
                // se ela for maior que zero
                if (transaction.amount > 0) {
                    //somar a uma variável e retornar a variavel
                    income += transaction.amount;
                }
                return income;

            })
            // somar entradas
        return income
    },

    expense() {
        let expense = 0;
        Transaction.all.forEach((transaction) => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense
    },

    total() {
        return Transaction.income() + Transaction.expense()
    },
}

const DOM = {
        transactionsContainer: document.querySelector('#data-table tbody'),

        addTransaction(transaction, index) {
            const tr = document.createElement('tr')
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
            tr.dataset.index = index

            DOM.transactionsContainer.appendChild(tr) //adicionar variavel transactionContainer


        },
        innerHTMLTransaction(transaction, index) {
            const CSSclasses = transaction.amount > 0 ? "income" : "expense" // troquei da variavel html 
            const amount = Utils.formatCurrency(transaction.amount)
            const html =
                `
                <td class=description>${transaction.description}</td>
                <td class=${CSSclasses}>${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação">
                </td>
            `
            return html
        },

        updateBalance() {
            document
                .getElementById('incomeDisplay')
                .innerHTML = Utils.formatCurrency(Transaction.income())

            document
                .getElementById('expenseDisplay')
                .innerHTML = Utils.formatCurrency(Transaction.expense())

            document
                .getElementById('totalDisplay')
                .innerHTML = Utils.formatCurrency(Transaction.total())

        },
        clearTransactions() {
            DOM.transactionsContainer.innerHTML = ""
        },

    }
    // transformar os números em formato de moeda.
const Utils = {
    formatAmount(value) {
        //retirar qualquer caracter que não seja número.
        value = value * 100
        return Math.round(value)
    },

    formatDate(date) {
        //slpit significa separar
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "" // garantindo que será número para colocar o sinal negativo
        value = String(value).replace(/\D/g, "") // garantindo que será string // replace troca algo por outro algo // -- // --duas barras define a pesquisa e a contrabarra escapa "/\D/" -- o \D significa "Ache tudo que não é número" e o g significa global 
        value = Number(value) / 100
        value = value.toLocaleString("pt-PT", {
            style: "currency",
            currency: "EUR"
        })

        return signal + value

    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    //recebe todos os objetos dos campos dos formulários
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        // variável irá puxar 3 dados de uma vez só do objeto form.getvalues
        const { description, amount, date } = Form.getValues()

        //trim limpa o campo
        //throw é cuspir vomitar jogar para fora
        //new é um construtor de novo argumento.

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }

    },

    // saveTransaction(transaction) {
    //     Transaction.add(transaction)
    // }

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },


    submit(event) {
        event.preventDefault()

        try {
            // tem que verificar se todas as informações foram preenchidas.
            Form.validateFields()

            // criar código para formatar os dados
            const transaction = Form.formatValues()

            //salvar os dados e Atualizar a aplicação
            Transaction.add(transaction)

            //apagar os dados
            Form.clearFields()

            // fechar o modal
            Modal.close()

        } catch (error) {

            alert(error.message)

        }





        Form.formatValues()






    }
}

const App = {
    init() {
        //Transaction.all.forEach((transaction, index) => {
        //  DOM.addTransaction(transaction, index)
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}
App.init()
