my.viewModel = function () {

    //Custom binding to load the values into the view model
    my.vm = function () {
        // this is knockout view model
        var self = this;

        self.items = ko.observableArray([]);
        self.currentPage = ko.observable(0);

        self.userId = ko.observable(0);
        self.title = ko.observable('');
        self.condition = ko.observable();
        self.postingCondition = ko.observable();
        //self.displayDate = ko.computed(function () {
        //    return moment(self.createdOnDate).format('LLL');
        //});
        self.priorityValue = ko.observable();
        self.priorityValueAmount = ko.observable();
        self.priorityDelivery = ko.observable();
        self.priorityDeliveryAmount = ko.observable();
        self.posterDisplayName = ko.observable('');
        self.postingDescription = ko.observable('');
        self.createdOnDate = ko.observable();
        self.qty = ko.observable();
        self.fromWho = ko.observable('');
        self.userInfo = ko.observable(my.userInfo);
        self.fileId = ko.observable(0);
        self.chosen = ko.observable('');
        self.query = ko.observable('');
        self.locales = ko.observable([]);
        self.premium = ko.observable();
        self.expiryDate = ko.observable();
        self.accountLevel = ko.observable();
        self.sellerPaid = ko.observable();
        self.soldBy = ko.observable();
        self.displayDate = ko.observable();
        self.modifiedOnDate = ko.observable();
        self.postingLocales = ko.observable();

        self.openImages = function (item, e) {
            if (e.clientX === 0) {
                return false;
            }
            e.preventDefault();

            let imagePath = $(e.target).prop('src').replace('thumbnail', 'large');
            imagePath = imagePath.replace('_thumb', '');

            $("#galleryModal #imagePath").attr({
                "src": imagePath
            });

            $('#galleryModal').modal('show');
        };

        // make view models available for apps
        return {
            items: items,
            currentPage: currentPage,
            userId: userId,
            title: title,
            priorityValue: priorityValue,
            priorityValueAmount: priorityValueAmount,
            priorityDelivery: priorityDelivery,
            priorityDeliveryAmount: priorityDeliveryAmount,
            posterDisplayName: posterDisplayName,
            postingDescription: postingDescription,
            condition: condition,
            postingCondition: postingCondition,
            displayDate: displayDate,
            createdOnDate: createdOnDate,
            fromWho: fromWho,
            // messages: messages,
            // filterMessageTerm: filterMessageTerm,
            // filteredMessages: filteredMessages,
            // pushMessage: pushMessage,
            openImages: openImages,
            fileId: fileId,
            chosen: chosen,
            query: query,
            locales: locales,
            qty: qty,
            premium: premium,
            expiryDate: expiryDate,
            accountLevel: accountLevel,
            sellerPaid: sellerPaid,
            soldBy: soldBy,
            modifiedOnDate: modifiedOnDate,
            postingLocales: postingLocales
        };

    }();

    ko.applyBindings(my.vm);

};