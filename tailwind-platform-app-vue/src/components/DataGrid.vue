<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Sort"
          label-for="sort-by-select"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
          v-slot="{ ariaDescribedby }"
        >
          <b-input-group size="sm">
            <b-form-select
              id="sort-by-select"
              v-model="sortBy"
              :options="sortOptions"
              :aria-describedby="ariaDescribedby"
              class="w-75"
            >
              <template #first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>

            <b-form-select
              v-model="sortDesc"
              :disabled="!sortBy"
              :aria-describedby="ariaDescribedby"
              size="sm"
              class="w-25"
            >
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filter"
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Type to Search"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="clearFilter">Clear</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Per page"
          label-for="per-page-select"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0"
        >
          <b-form-select
            id="per-page-select"
            v-model="perPage"
            :options="pageOptions"
            size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
      :items="sortedAndFilteredData"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      stacked="md"
      show-empty
      small
      @filtered="onFiltered"
    >
      <!-- Customize the columns as needed -->
      <template #cell(name)="row">
        {{ row.item.name }}
      </template>
      <template #cell(color)="row">
        {{ row.item.color }}
      </template>
      <template #cell(length)="row">
        {{ row.item.length }}
      </template>
      <template #cell(date_created)="row">
        {{ row.item.date_created }}
      </template>
      <template #cell(date_updated)="row">
        {{ row.item.date_updated }}
      </template>
      <template #cell(location)="row">
        {{ row.item.location }}
      </template>
      <template #cell(actions)="row">
        <!-- Add your action buttons here -->
        <b-button size="sm" @click="editItem(row.item)">Edit</b-button>
        <b-button size="sm" @click="deleteItem(row.item)">Delete</b-button>
      </template>
    </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
      ></b-pagination>
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      data: [], // Store your data here
      fields: [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'color', label: 'Color', sortable: true },
        { key: 'length', label: 'Length', sortable: true },
        { key: 'date_created', label: 'Date Created', sortable: true },
        { key: 'date_updated', label: 'Date Updated', sortable: true },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'actions', label: 'Actions' } // Added actions column
      ],
      sortBy: '',
      sortDesc: false,
      filter: null,
      pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
      filterOn: [],
      currentPage: 1,
      perPage: 10,
      totalRows: 0
    }
  },
  computed: {
    // Computed property to filter and sort data based on user selections
    sortedAndFilteredData() {
      let data = [...this.data]

      if (this.filter) {
        const filter = this.filter.toLowerCase()
        data = data.filter((item) => {
          return Object.values(item).some((value) => {
            if (typeof value === 'string') {
              return value.toLowerCase().includes(filter)
            }
            return false
          })
        })
      }

      if (this.sortBy) {
        data = data.sort((a, b) => {
          const fieldA = a[this.sortBy]
          const fieldB = b[this.sortBy]
          if (this.sortDesc) {
            return fieldA > fieldB ? -1 : 1
          } else {
            return fieldA > fieldB ? 1 : -1
          }
        })
      }

      return data
    }
  },
  methods: {
    // Add your edit and delete item methods here
    editItem(item) {
      // Handle edit item action
      console.log('Edit item:', item)
    },
    deleteItem(item) {
      // Handle delete item action
      console.log('Delete item:', item)
    },
    clearFilter() {
      this.filter = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    updateSort(sortBy) {
      if (this.sortBy === sortBy) {
        this.sortDesc = !this.sortDesc
      } else {
        this.sortBy = sortBy
        this.sortDesc = false
      }
    }
  },
  mounted() {
    // Fetch data from your API using Axios
    axios
      .get('http://localhost:3004/platforms')
      .then((response) => {
        this.data = response.data
        this.totalRows = this.data.length
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }
}
</script>

<style scoped>
/* Add Tailwind CSS classes for styling */
</style>
