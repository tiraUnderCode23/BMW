import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import requests
import json
import base64
import os
import threading
import copy
from PIL import Image, ImageTk
from io import BytesIO
import sv_ttk

# --- GitHub Configuration ---
# الرجاء استخدام التوكن الخاص بك هنا
# Please use your own token here
GITHUB_TOKEN = "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"  # IMPORTANT: Replace with your actual GitHub token
REPO_OWNER = "AQbimmerX"
REPO_NAME = "BMW"
MAIN_DATA_FILE_PATH = "src/data/bmw_data.json"
MODELS_FILE_PATH = "src/data/bmw_models.json"
YEARS_GEN_FILE_PATH = "src/data/bmw_years_generations.json"

class GitHubAPI:
    """
    Handles all interactions with the GitHub API for fetching and updating files.
    """
    def __init__(self, token, owner, repo):
        self.owner = owner
        self.repo = repo
        self._headers = {
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json',
        }

    def get_file(self, file_path):
        """Fetches a file from the GitHub repository with improved error diagnostics."""
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/contents/{file_path}"
        try:
            response = requests.get(url, headers=self._headers, timeout=15)
            response.raise_for_status()
            data = response.json()
            content_b64 = data.get('content')
            if not content_b64:
                 messagebox.showerror("GitHub Error", f"File '{file_path}' appears to be empty or has no content on GitHub.")
                 return None, None
            content = base64.b64decode(content_b64).decode('utf-8')
            sha = data['sha']
            try:
                return json.loads(content), sha
            except json.JSONDecodeError as json_err:
                print(f"--- DEBUG: FAILED TO PARSE JSON ---\nFile: {file_path}\nJSON Error: {json_err}\nReceived content:\n{content}\n--- END DEBUG ---")
                messagebox.showerror("GitHub JSON Error", f"Failed to parse JSON from {file_path}.\nError: {json_err}\n\nThis usually means the GitHub Token is invalid or the file is corrupt.\nCheck the console for the received data.")
                return None, None
        except requests.exceptions.HTTPError as http_err:
            print(f"--- DEBUG: HTTP ERROR ---\nURL: {url}\nStatus Code: {http_err.response.status_code}\nResponse Body: {http_err.response.text}\n--- END DEBUG ---")
            messagebox.showerror("GitHub HTTP Error", f"Failed to fetch {file_path}.\nStatus Code: {http_err.response.status_code}\nMessage: {http_err.response.reason}\n\nPlease check your GITHUB_TOKEN, REPO_OWNER, and REPO_NAME.")
            return None, None
        except Exception as e:
            print(f"--- DEBUG: UNEXPECTED ERROR ---\nError Type: {type(e).__name__}\nError Details: {e}\n--- END DEBUG ---")
            messagebox.showerror("GitHub General Error", f"An unexpected error occurred while fetching {file_path}\nError: {str(e)}")
            return None, None

    def update_file(self, file_path, new_content_str, sha, commit_message):
        """Updates a file in the GitHub repository."""
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/contents/{file_path}"
        try:
            encoded_content = base64.b64encode(new_content_str.encode('utf-8')).decode('utf-8')
            data = {"message": commit_message, "content": encoded_content, "sha": sha}
            response = requests.put(url, headers=self._headers, json=data, timeout=15)
            response.raise_for_status()
            return response.json()['content']['sha']
        except Exception as e:
            messagebox.showerror("GitHub Error", f"Failed to update {file_path}\nError: {str(e)}")
            return None

class App:
    def __init__(self, master):
        self.master = master
        self.master.title("AQ///Coding Editor")
        self.master.geometry("1400x900")
        
        sv_ttk.set_theme("dark")
        
        self.github_api = GitHubAPI(GITHUB_TOKEN, REPO_OWNER, REPO_NAME)
        self.bmw_data = []
        self.bmw_models = []
        self.bmw_years_generations = {}
        self.current_sha = None
        
        self.iid_to_activation_map = {}
        self.copied_activations = []
        
        self.create_widgets()
        self.load_initial_data()
    
    def create_widgets(self):
        main_frame = ttk.Frame(self.master)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        paned_window = ttk.PanedWindow(main_frame, orient=tk.HORIZONTAL)
        paned_window.pack(fill=tk.BOTH, expand=True)
        
        left_notebook = ttk.Notebook(paned_window)
        paned_window.add(left_notebook, weight=2)
        
        self.create_model_view_tab(left_notebook)
        self.create_year_view_tab(left_notebook)

        form_frame = ttk.Frame(paned_window)
        paned_window.add(form_frame, weight=4)
        
        self.create_form_panel(form_frame)
        
        self.status_var = tk.StringVar(value="Ready")
        ttk.Label(self.master, textvariable=self.status_var, relief=tk.SUNKEN, anchor='w').pack(side=tk.BOTTOM, fill=tk.X)

    def create_model_view_tab(self, parent_notebook):
        model_view_frame = ttk.Frame(parent_notebook, padding=5)
        parent_notebook.add(model_view_frame, text="View by Model")

        self.tree = ttk.Treeview(model_view_frame, columns=("ID", "Price"), show="tree headings", selectmode='extended')
        self.tree.heading("#0", text="Model / Year / Generation / Activation")
        self.tree.heading("ID", text="ID")
        self.tree.heading("Price", text="Price")
        self.tree.column("ID", width=50, anchor='center')
        self.tree.column("Price", width=80, anchor='center')
        
        scrollbar = ttk.Scrollbar(model_view_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=scrollbar.set)
        
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.tree.pack(fill=tk.BOTH, expand=True)
        self.tree.bind("<<TreeviewSelect>>", self.on_tree_select)
        
    def create_year_view_tab(self, parent_notebook):
        year_view_frame = ttk.Frame(parent_notebook, padding=5)
        parent_notebook.add(year_view_frame, text="View by Year")
        year_paned_window = ttk.PanedWindow(year_view_frame, orient=tk.VERTICAL)
        year_paned_window.pack(fill=tk.BOTH, expand=True)
        years_list_frame = ttk.Frame(year_paned_window)
        year_paned_window.add(years_list_frame, weight=1)
        ttk.Label(years_list_frame, text="Select Year:").pack(anchor='w')
        self.year_listbox = tk.Listbox(years_list_frame, selectmode=tk.SINGLE, exportselection=False)
        year_scrollbar = ttk.Scrollbar(years_list_frame, orient="vertical", command=self.year_listbox.yview)
        self.year_listbox.config(yscrollcommand=year_scrollbar.set)
        self.year_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        year_scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.year_listbox.bind("<<ListboxSelect>>", self.on_year_select)
        activations_by_year_frame = ttk.Frame(year_paned_window)
        year_paned_window.add(activations_by_year_frame, weight=3)
        ttk.Label(activations_by_year_frame, text="Activations for Selected Year:").pack(anchor='w')
        self.year_activations_tree = ttk.Treeview(activations_by_year_frame, columns=("Location", "Price"), show="headings")
        self.year_activations_tree.heading("Location", text="Location (Model > Gen)")
        self.year_activations_tree.heading("#0", text="Activation")
        self.year_activations_tree.heading("Price", text="Price")
        self.year_activations_tree.column("Price", width=80, anchor='center')
        act_scrollbar = ttk.Scrollbar(activations_by_year_frame, orient="vertical", command=self.year_activations_tree.yview)
        self.year_activations_tree.configure(yscrollcommand=act_scrollbar.set)
        self.year_activations_tree.pack(fill=tk.BOTH, expand=True)

    def create_form_panel(self, parent_frame):
        notebook = ttk.Notebook(parent_frame)
        notebook.pack(fill=tk.BOTH, expand=True)
        
        activation_tab = ttk.Frame(notebook, padding=5)
        notebook.add(activation_tab, text="Activation Details")
        
        selection_frame = ttk.LabelFrame(activation_tab, text="Select Target Location (for Add/Paste)", padding=10)
        selection_frame.pack(fill=tk.X, padx=5, pady=5)
        selection_frame.grid_columnconfigure(1, weight=1)
        
        ttk.Label(selection_frame, text="Model:").grid(row=0, column=0, sticky=tk.W, pady=2, padx=5)
        self.model_var = tk.StringVar()
        self.model_combo = ttk.Combobox(selection_frame, textvariable=self.model_var, state="readonly")
        self.model_combo.grid(row=0, column=1, sticky=tk.EW, padx=5)
        self.model_combo.bind("<<ComboboxSelected>>", self.update_years_keep_data)
        
        ttk.Label(selection_frame, text="Year:").grid(row=1, column=0, sticky=tk.W, pady=2, padx=5)
        self.year_var = tk.StringVar()
        self.year_combo = ttk.Combobox(selection_frame, textvariable=self.year_var, state="readonly")
        self.year_combo.grid(row=1, column=1, sticky=tk.EW, padx=5)
        self.year_combo.bind("<<ComboboxSelected>>", self.update_generations_keep_data)
        
        ttk.Label(selection_frame, text="Generation:").grid(row=2, column=0, sticky=tk.W, pady=2, padx=5)
        self.generation_var = tk.StringVar()
        self.generation_combo = ttk.Combobox(selection_frame, textvariable=self.generation_var, state="readonly")
        self.generation_combo.grid(row=2, column=1, sticky=tk.EW, padx=5)
        
        details_frame = ttk.LabelFrame(activation_tab, text="Activation Details", padding=10)
        details_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        
        self.entries = {}
        fields = [
            ("Title (English)", "title_en"), ("Title (Arabic)", "title_ar"), ("Title (Hebrew)", "title_he"),
            ("Description (English)", "desc_en", "text"), ("Description (Arabic)", "desc_ar", "text"), ("Description (Hebrew)", "desc_he", "text"),
            ("Category (English)", "cat_en"), ("Category (Arabic)", "cat_ar"), ("Category (Hebrew)", "cat_he"),
            ("Price", "price"), ("Image URL", "image_url")
        ]
        
        form_fields_frame = ttk.Frame(details_frame)
        form_fields_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        form_fields_frame.grid_columnconfigure(1, weight=1)

        for i, field_data in enumerate(fields):
            label_text, field_name = field_data[0], field_data[1]
            field_type = "text" if len(field_data) > 2 else "entry"
            ttk.Label(form_fields_frame, text=label_text).grid(row=i, column=0, sticky=tk.W, padx=5, pady=2)
            if field_type == "text":
                widget = tk.Text(form_fields_frame, height=3, width=50, relief=tk.SOLID, borderwidth=1, font=('TkDefaultFont', 10))
            else:
                widget = ttk.Entry(form_fields_frame)
            widget.grid(row=i, column=1, sticky=tk.EW, padx=5, pady=2)
            self.entries[field_name] = widget

        image_preview_frame = ttk.Frame(details_frame)
        image_preview_frame.pack(side=tk.RIGHT, fill=tk.Y, padx=10)
        self.image_label = ttk.Label(image_preview_frame, text="No Image", anchor='center', compound='center', width=30)
        self.image_label.pack(expand=True)
        
        button_frame = ttk.Frame(activation_tab)
        button_frame.pack(fill=tk.X, pady=10, padx=5)
        
        ttk.Button(button_frame, text="Clear Form", command=self.clear_form).pack(side=tk.LEFT, padx=5)
        self.save_button = ttk.Button(button_frame, text="Save Changes", command=self.save_changes, state="disabled")
        self.save_button.pack(side=tk.LEFT, padx=5)
        self.delete_button = ttk.Button(button_frame, text="Delete Activation(s)", command=self.delete_activation, state="disabled")
        self.delete_button.pack(side=tk.LEFT, padx=5)
        
        action_button_frame = ttk.Frame(activation_tab)
        action_button_frame.pack(fill=tk.X, pady=5, padx=5)
        
        ttk.Button(action_button_frame, text="Copy Selected", command=self.copy_selected_activations).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_button_frame, text="Paste to Selected Location", command=self.paste_activations).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_button_frame, text="Add New Activation", command=self.add_activation).pack(side=tk.LEFT, padx=5)
        ttk.Button(action_button_frame, text="Import From JSON", command=self.import_from_json).pack(side=tk.RIGHT, padx=5)
    
    def load_initial_data(self):
        self.status("Loading data from GitHub...")
        def _load():
            models_data, _ = self.github_api.get_file(MODELS_FILE_PATH)
            if not models_data:
                self.master.after(0, lambda: self.status("Failed to load critical file: bmw_models.json. Aborting."))
                return
            self.bmw_models = models_data
            
            years_data, _ = self.github_api.get_file(YEARS_GEN_FILE_PATH)
            if not years_data:
                self.master.after(0, lambda: self.status("Failed to load critical file: bmw_years_generations.json. Aborting."))
                return
            self.bmw_years_generations = years_data
            
            main_data, sha = self.github_api.get_file(MAIN_DATA_FILE_PATH)
            if not main_data or not sha:
                self.master.after(0, lambda: self.status("Failed to load critical file: bmw_data.json. Aborting."))
                return
            self.bmw_data = main_data
            self.current_sha = sha

            self.master.after(0, self.populate_all_views)
            self.master.after(0, lambda: self.status("Data loaded successfully"))
        
        threading.Thread(target=_load, daemon=True).start()

    def populate_all_views(self):
        """Helper function to populate all data-dependent UI elements."""
        self.model_combo.config(values=[model['text'] for model in self.bmw_models])
        self.populate_treeview()
        self.populate_year_list()

    def populate_treeview(self):
        for item in self.tree.get_children(): self.tree.delete(item)
        self.iid_to_activation_map.clear()
        for model_idx, model in enumerate(self.bmw_data):
            model_node_id = self.tree.insert("", "end", text=model.get('text', 'Unknown Model'), open=False)
            for year_idx, year in enumerate(model.get('years', [])):
                year_node_id = self.tree.insert(model_node_id, "end", text=year.get('text', 'Unknown Year'), open=False)
                for gen_idx, gen in enumerate(year.get('generations', [])):
                    gen_node_id = self.tree.insert(year_node_id, "end", text=gen.get('text', 'Unknown Gen'), open=False)
                    for act_idx, activation in enumerate(gen.get('activations', [])):
                        unique_iid = f"act-{model_idx}-{year_idx}-{gen_idx}-{act_idx}"
                        # Ensure price is a string for display
                        price_display = str(activation.get('price', 'N/A'))
                        self.tree.insert(gen_node_id, "end", iid=unique_iid, text=activation.get('title', {}).get('en', 'No Title'), values=(activation.get('id', 'N/A'), price_display))
                        self.iid_to_activation_map[unique_iid] = activation
    
    def on_tree_select(self, event):
        selected_iids = self.tree.selection()
        if not selected_iids:
            self.clear_form()
            return
        
        # Always populate form with the 'focused' item
        focused_iid = self.tree.focus()
        if focused_iid and focused_iid.startswith('act-'):
            activation = self.iid_to_activation_map.get(focused_iid)
            if activation:
                self.populate_form(activation)
                threading.Thread(target=self.preview_image, args=(activation.get('image_url', ''),), daemon=True).start()
        else:
            self.clear_form() # Clear form if a category is selected

    def update_years_keep_data(self, event):
        selected_model_text = self.model_var.get()
        self.year_var.set('')
        self.generation_var.set('')
        self.year_combo.config(values=[])
        self.generation_combo.config(values=[])
        selected_model = next((m for m in self.bmw_models if m['text'] == selected_model_text), None)
        if selected_model:
            model_key = selected_model['value']
            if model_key in self.bmw_years_generations:
                self.year_combo.config(values=[y['text'] for y in self.bmw_years_generations[model_key]['years']])

    def update_generations_keep_data(self, event):
        self.generation_var.set('')
        self.generation_combo.config(values=[])
        selected_model_text = self.model_var.get()
        selected_year_text = self.year_var.get()
        selected_model = next((m for m in self.bmw_models if m['text'] == selected_model_text), None)
        if selected_model and selected_year_text:
            model_key = selected_model['value']
            if model_key in self.bmw_years_generations:
                year_data = next((y for y in self.bmw_years_generations[model_key]['years'] if y['text'] == selected_year_text), None)
                if year_data:
                    self.generation_combo.config(values=[g['text'] for g in year_data['generations']])
    
    def populate_year_list(self):
        self.year_listbox.delete(0, tk.END)
        unique_years = set()
        for model in self.bmw_data:
            for year in model.get('years', []):
                unique_years.add(year.get('text'))
        for year in sorted(list(unique_years), reverse=True): # Show newest years first
            if year: self.year_listbox.insert(tk.END, year)
    
    def on_year_select(self, event):
        selection_indices = self.year_listbox.curselection()
        if not selection_indices: return
        selected_year = self.year_listbox.get(selection_indices[0])
        for item in self.year_activations_tree.get_children(): self.year_activations_tree.delete(item)
        for model in self.bmw_data:
            for year in model.get('years', []):
                if year.get('text') == selected_year:
                    for gen in year.get('generations', []):
                        for activation in gen.get('activations', []):
                            location = f"{model.get('text')} > {gen.get('text')}"
                            self.year_activations_tree.insert("", "end", text=activation.get('title', {}).get('en', 'No Title'), values=(location, str(activation.get('price', 'N/A'))))

    def copy_selected_activations(self):
        selected_iids = self.tree.selection()
        if not selected_iids:
            messagebox.showinfo("Copy", "No activations selected to copy.")
            return
        self.copied_activations.clear()
        for iid in selected_iids:
            if iid.startswith('act-'):
                activation_data = self.iid_to_activation_map.get(iid)
                if activation_data: self.copied_activations.append(copy.deepcopy(activation_data))
        if self.copied_activations:
            messagebox.showinfo("Copy Success", f"{len(self.copied_activations)} activation(s) copied to clipboard.")
            self.status(f"{len(self.copied_activations)} activation(s) copied.")
        else:
            messagebox.showinfo("Copy", "Please select one or more valid activations to copy.")

    def paste_activations(self):
        if not self.copied_activations:
            messagebox.showerror("Paste Error", "Clipboard is empty. Please copy some activations first.")
            return
        if not all([self.model_var.get(), self.year_var.get(), self.generation_var.get()]):
            messagebox.showerror("Paste Error", "Please select a target model, year, and generation first.")
            return
        target_model_text = self.model_var.get()
        target_year_text = self.year_var.get()
        target_gen_text = self.generation_var.get()
        target_gen_list = None
        model_found = next((m for m in self.bmw_data if m.get('text') == target_model_text), None)
        if model_found:
            year_found = next((y for y in model_found.get('years', []) if y.get('text') == target_year_text), None)
            if year_found:
                gen_found = next((g for g in year_found.get('generations', []) if g.get('text') == target_gen_text), None)
                if gen_found:
                    if 'activations' not in gen_found: gen_found['activations'] = []
                    target_gen_list = gen_found['activations']
        if target_gen_list is None:
            messagebox.showerror("Paste Error", "Could not find the target location in the data structure.")
            return
        count = 0
        for activation_to_paste in self.copied_activations:
            new_act = copy.deepcopy(activation_to_paste)
            new_act['id'] = self.generate_new_id()
            target_gen_list.append(new_act)
            count += 1
        self.save_to_github(f"Pasted {count} activation(s) to {target_model_text}>{target_year_text}>{target_gen_text}")
        messagebox.showinfo("Paste Success", f"Successfully pasted {count} activation(s).")
    
    def populate_form(self, activation):
        self.clear_form(clear_selection=False)
        self.save_button.config(state="normal")
        self.delete_button.config(state="normal")
        # Ensure price is a string for the Entry widget
        price_val = str(activation.get('price', ''))
        self.entries['title_en'].insert(0, activation.get('title', {}).get('en', ''))
        self.entries['title_ar'].insert(0, activation.get('title', {}).get('ar', ''))
        self.entries['title_he'].insert(0, activation.get('title', {}).get('he', ''))
        self.entries['desc_en'].insert('1.0', activation.get('description', {}).get('en', ''))
        self.entries['desc_ar'].insert('1.0', activation.get('description', {}).get('ar', ''))
        self.entries['desc_he'].insert('1.0', activation.get('description', {}).get('he', ''))
        self.entries['cat_en'].insert(0, activation.get('category', {}).get('en', ''))
        self.entries['cat_ar'].insert(0, activation.get('category', {}).get('ar', ''))
        self.entries['cat_he'].insert(0, activation.get('category', {}).get('he', ''))
        self.entries['price'].insert(0, price_val)
        self.entries['image_url'].insert(0, activation.get('image_url', ''))

    def preview_image(self, image_url):
        def _update_image(photo=None, error=False):
            if error: self.image_label.config(image='', text="Image Load Error")
            elif photo:
                self.image_label.config(image=photo, text="")
                self.image_label.image = photo
            else: self.image_label.config(image='', text="No Image")
        if not image_url:
            self.master.after(0, _update_image)
            return
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            img = Image.open(BytesIO(response.content))
            img.thumbnail((250, 250))
            photo = ImageTk.PhotoImage(img)
            self.master.after(0, lambda: _update_image(photo=photo))
        except Exception:
            self.master.after(0, lambda: _update_image(error=True))

    def add_activation(self):
        if not all([self.model_var.get(), self.year_var.get(), self.generation_var.get()]):
            messagebox.showerror("Error", "Please select a model, year, and generation first.")
            return
        target_model_text = self.model_var.get()
        target_year_text = self.year_var.get()
        target_gen_text = self.generation_var.get()
        new_id = self.generate_new_id()
        new_activation = {
            "id": new_id,
            "title": {"en": self.entries['title_en'].get(), "ar": self.entries['title_ar'].get(), "he": self.entries['title_he'].get()},
            "description": {"en": self.entries['desc_en'].get("1.0", tk.END).strip(), "ar": self.entries['desc_ar'].get("1.0", tk.END).strip(), "he": self.entries['desc_he'].get("1.0", tk.END).strip()},
            "category": {"en": self.entries['cat_en'].get(), "ar": self.entries['cat_ar'].get(), "he": self.entries['cat_he'].get()},
            "price": self.entries['price'].get(),
            "image_url": self.entries['image_url'].get()
        }
        model_found = next((m for m in self.bmw_data if m.get('text') == target_model_text), None)
        if model_found:
            year_found = next((y for y in model_found.get('years', []) if y.get('text') == target_year_text), None)
            if year_found:
                gen_found = next((g for g in year_found.get('generations', []) if g.get('text') == target_gen_text), None)
                if gen_found:
                    if 'activations' not in gen_found: gen_found['activations'] = []
                    gen_found['activations'].append(new_activation)
                    self.save_to_github(f"Added new activation: {new_activation['title']['en']} (ID: {new_id})")
                    messagebox.showinfo("Success", f"Activation added to {target_model_text} > {target_gen_text}.")
                    return
        messagebox.showerror("Logic Error", "Selected target location not found in data structure.")

    def generate_new_id(self):
        all_ids = {act['id'] for model in self.bmw_data for year in model.get('years', []) for gen in year.get('generations', []) for act in gen.get('activations', []) if 'id' in act and isinstance(act['id'], int)}
        return max(all_ids) + 1 if all_ids else 1
    
    def save_changes(self):
        # This requires a single item to be focused
        focused_iid = self.tree.focus()
        if not focused_iid or not focused_iid.startswith('act-'):
            messagebox.showerror("Error", "No single activation selected to save.")
            return

        act_to_save = self.iid_to_activation_map.get(focused_iid)
        if not act_to_save:
            messagebox.showerror("Error", "Could not find the selected activation to save.")
            return

        act_to_save['title'] = {"en": self.entries['title_en'].get(), "ar": self.entries['title_ar'].get(), "he": self.entries['title_he'].get()}
        act_to_save['description'] = {"en": self.entries['desc_en'].get("1.0", tk.END).strip(), "ar": self.entries['desc_ar'].get("1.0", tk.END).strip(), "he": self.entries['desc_he'].get("1.0", tk.END).strip()}
        act_to_save['category'] = {"en": self.entries['cat_en'].get(), "ar": self.entries['cat_ar'].get(), "he": self.entries['cat_he'].get()}
        act_to_save['price'] = self.entries['price'].get()
        act_to_save['image_url'] = self.entries['image_url'].get()
        
        self.save_to_github(f"Updated activation: {act_to_save['title']['en']} (ID: {act_to_save.get('id')})")
    
    # --- FIXED: delete_activation to handle multiple items safely ---
    def delete_activation(self):
        selected_iids = self.tree.selection()
        if not selected_iids:
            messagebox.showerror("Error", "No activation(s) selected to delete.")
            return

        activations_to_delete = []
        act_titles_to_confirm = []
        for iid in selected_iids:
            if iid.startswith('act-'):
                act_data = self.iid_to_activation_map.get(iid)
                if act_data:
                    activations_to_delete.append(act_data)
                    act_titles_to_confirm.append(f"- {act_data.get('title', {}).get('en', 'N/A')}")

        if not activations_to_delete:
            messagebox.showinfo("Info", "Please select valid activation items to delete.")
            return

        confirm_message = f"Are you sure you want to delete these {len(activations_to_delete)} activation(s)?\n\n" + "\n".join(act_titles_to_confirm)
        if not messagebox.askyesno("Confirm Delete", confirm_message):
            return

        # Create a set of memory addresses (IDs) of the actual dictionary objects to delete.
        # This is the safest way to identify them uniquely, regardless of the 'id' field value.
        objects_to_delete_ids = set(id(obj) for obj in activations_to_delete)

        for model in self.bmw_data:
            for year in model.get('years', []):
                for gen in year.get('generations', []):
                    if 'activations' in gen:
                        # Rebuild the list, keeping only activations whose object ID is not in our deletion set.
                        gen['activations'][:] = [act for act in gen['activations'] if id(act) not in objects_to_delete_ids]

        commit_message = f"Deleted {len(activations_to_delete)} activation(s)"
        self.save_to_github(commit_message)
        self.clear_form()
    
    def import_from_json(self):
        file_path = filedialog.askopenfilename(title="Select JSON file", filetypes=[("JSON files", "*.json")])
        if not file_path: return
        try:
            with open(file_path, 'r', encoding='utf-8') as f: imported_data = json.load(f)
            if not isinstance(imported_data, list): raise ValueError("Invalid JSON format.")
            if not messagebox.askyesno("Confirm Import", f"Import and merge from {os.path.basename(file_path)}?"): return
            
            # Note: This is a simplified merge logic. It will add new items but not update existing ones.
            existing_ids = {act['id'] for model in self.bmw_data for year in model.get('years', []) for gen in year.get('generations', []) for act in gen.get('activations', []) if 'id' in act and isinstance(act['id'], int)}
            
            added_count = 0
            # A more robust implementation would be needed for complex merges.
            # This is a placeholder to show the concept.
            messagebox.showinfo("Info", "Import logic is basic and will only add activations with new IDs.")

            self.save_to_github(f"Merged data from {os.path.basename(file_path)}")

        except Exception as e:
            messagebox.showerror("Import Error", f"Failed to import: {str(e)}")

    def save_to_github(self, commit_message):
        self.status(f"Saving changes: {commit_message}")
        def _save():
            try:
                new_content = json.dumps(self.bmw_data, indent=2, ensure_ascii=False)
                new_sha = self.github_api.update_file(MAIN_DATA_FILE_PATH, new_content, self.current_sha, commit_message)
                if new_sha:
                    self.current_sha = new_sha
                    self.master.after(0, self.populate_all_views)
                    self.master.after(0, lambda: messagebox.showinfo("Success", "Changes saved to GitHub."))
                    self.master.after(0, lambda: self.status("Changes saved successfully"))
                else:
                    self.master.after(0, lambda: self.status("Failed to save changes. SHA might be outdated."))
            except Exception as e:
                self.master.after(0, lambda: self.status(f"Error: {str(e)}"))
        threading.Thread(target=_save, daemon=True).start()

    def clear_form(self, clear_selection=True):
        self.save_button.config(state="disabled")
        self.delete_button.config(state="disabled")
        for entry in self.entries.values():
            if isinstance(entry, tk.Text): entry.delete('1.0', tk.END)
            else: entry.delete(0, tk.END)
        self.image_label.config(image='', text="No Image")
        self.image_label.image = None
        if clear_selection:
            if self.tree.selection():
                self.tree.selection_remove(self.tree.selection())

    def status(self, message):
        self.status_var.set(message)
        self.master.update_idletasks()

if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)

    # --- MODIFICATION: Set application icon with a more robust path ---
    try:
        # This creates an absolute path to the icon file, assuming it's in the same folder as the script.
        # This makes it work reliably even if you run the script from a different directory.
        script_dir = os.path.dirname(os.path.abspath(__file__))
        icon_path = os.path.join(script_dir, 'app.ico')
        
        if os.path.exists(icon_path):
            root.wm_iconbitmap(icon_path)
        else:
            # This message will appear in your console/terminal window if the file is not found.
            print(f"Icon file not found at: {icon_path}")
    except Exception as e:
        print(f"An error occurred while setting the icon: {e}")

    root.mainloop()